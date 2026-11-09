import {AtlasScene} from './scene.js';
import {TRACKS,LOOKS,CHOICES} from './world.js';
import {JourneyTransport,locateTime,cueAt,cameraAt} from './timeline.js';

const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const format=t=>`${Math.floor(Math.max(0,t)/60)}:${pad(Math.floor(Math.max(0,t)%60))}`;
const getJSON=async url=>{const response=await fetch(url);if(!response.ok)throw new Error(`Could not load ${url}`);return response.json();};
const NOTES=[
  ['An ordinary room can be the beginning of an entire world.','Look beyond the frame. The room and the landscape belong to the same territory.','Utopia might be something we make where we already are.'],
  ['What lies outside the view we have learned to recognize?','Before a change becomes visible, there can be a moment of suspension.','The ground stays beneath us. Another perspective reveals a different world.','The most difficult geography to read can be the one within us.'],
  ['A monument promises that something extraordinary happens here.','Paths gather into an arena of attraction and distraction.','Recognition fills the space. Connection asks for something more.'],
  ['Leaving a place does not always mean arriving somewhere else.','The islands are near enough to see, but not always near enough to reach.','Belonging is a connection, not a measurement of distance.'],
  ['The landscape opens, and there is room to slow down.','Water moves through the place, carrying traces of what came before.','A place of refuge can be a pause rather than an escape.'],
  ['Having more and feeling fulfilled can point in different directions.','From higher ground, the things we pursued begin to look different.','The horizon opens. The places below remain part of the view.','Choose what matters to you. There is more than one place to arrive.'],
  ['An ending can still hold the question of where to go next.','The place you choose does not have to be the place you stay.','Keep exploring. No fixed destination.'],
];

let chapters,durations,starts,peaks,scene,transport=null,context=null;
let started=false,mode='overview',selectedTrack=5,currentIndex=0,position=0,frame=0;
let localSources=null,loading=null,loadingGeneration=0,playIntent=0,muted=false,selectedChoice=null;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let messageTimer,scrubResume=false;

function notify(message,persist=false){clearTimeout(messageTimer);$('message').textContent=message;$('message').hidden=false;if(!persist)messageTimer=setTimeout(()=>$('message').hidden=true,5500);}
function markStarted(){started=true;$('welcome').hidden=true;$('journey-nav').hidden=false;}
function setMode(next){mode=next;$('return-journey').hidden=next!=='explore';$('mode-label').textContent=next==='explore'?'EXPLORING THE ATLAS':'THE JOURNEY';}
function enterExplore(){playIntent++;markStarted();transport?.pause();setMode('explore');$('choices').hidden=true;}
function contextForGesture(){if(!context){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)throw new Error('This browser does not support Web Audio. You can still explore the atlas.');context=new AudioContext();context.addEventListener('statechange',()=>{if(context.state==='suspended'&&transport?.state==='playing'){transport.pause();notify('Audio was interrupted. Press play to resume the journey.');}});}return context;}

async function decodeChapter(audioContext,chapter,arrayBuffer,prepared){
  const decoded=await audioContext.decodeAudioData(arrayBuffer);
  const duration=chapter.sourceOut-chapter.sourceIn;
  const start=prepared?0:chapter.sourceIn;
  if(!prepared&&chapter.sourceDuration&&Math.abs(decoded.duration-chapter.sourceDuration)>.2)throw new Error(`${chapter.trackTitle}: this file has a different duration from the reference recording. Select the supplied edition or prepared WAV clip.`);
  if(decoded.duration+0.04<start+duration)throw new Error(`${chapter.trackTitle}: the selected file is shorter than the required passage.`);
  const frames=Math.round(duration*decoded.sampleRate),offset=Math.round(start*decoded.sampleRate);
  const excerpt=audioContext.createBuffer(decoded.numberOfChannels,frames,decoded.sampleRate);
  for(let channel=0;channel<decoded.numberOfChannels;channel++){
    excerpt.copyToChannel(decoded.getChannelData(channel).subarray(offset,offset+frames),channel);
    if(!prepared){const samples=excerpt.getChannelData(channel),fadeIn=Math.round(.025*decoded.sampleRate),fadeOut=Math.round(.08*decoded.sampleRate);for(let i=0;i<fadeIn;i++)samples[i]*=i/fadeIn;for(let i=0;i<fadeOut;i++)samples[frames-1-i]*=i/fadeOut;}
  }
  return excerpt;
}

async function prepareSources(sources){
  if(loading)return loading;
  const generation=++loadingGeneration,audioContext=contextForGesture();
  // Resume during the original click, before the asynchronous decode work.
  const resumed=audioContext.resume();
  $('enter').disabled=true;$('play').disabled=true;
  loading=(async()=>{
    await resumed;const buffers=[];
    for(let i=0;i<chapters.length;i++){
      $('audio-status').textContent=`Preparing sound ${i+1} / ${chapters.length}`;
      const source=sources[i];
      let bytes;
      if(source.file)bytes=await source.file.arrayBuffer();
      else{const response=await fetch(source.url);if(!response.ok)throw new Error(`The local excerpt for ${chapters[i].trackTitle} could not be loaded.`);bytes=await response.arrayBuffer();}
      const buffer=await decodeChapter(audioContext,chapters[i],bytes,source.prepared);
      if(generation!==loadingGeneration)return null;
      buffers.push(buffer);
    }
    transport?.destroy();transport=new JourneyTransport(audioContext,buffers,durations);
    transport.setVolume(muted?0:Number($('volume').value));transport.seek(position);
    transport.addEventListener('change',()=>{position=transport.position;paint();scheduleFrame();});
    $('audio-status').textContent='Soundtrack ready · 7 passages';return transport;
  })().finally(()=>{if(generation===loadingGeneration){loading=null;$('enter').disabled=false;$('play').disabled=false;}});
  return loading;
}

async function playJourney(){
  if(transport?.state==='playing'){transport.pause();return;}
  if(!transport&&!localSources){$('audio-files').click();notify('Select the seven prepared WAV clips, or your UTOPIA album files. They stay on your computer.');return;}
  markStarted();setMode('guided');
  const request=++playIntent;
  try{
    const player=transport||await prepareSources(localSources);
    if(!player||request!==playIntent)return;
    scene.mode='guided';await player.play();
  }catch(error){$('audio-status').textContent='Select audio to try again';notify(error.message,true);setMode('explore');scene.overview();paint();}
}

function jumpChapter(index,autoplay=false){
  index=Math.max(0,Math.min(chapters.length-1,index));markStarted();setMode('guided');scene.mode='guided';
  currentIndex=index;selectedTrack=LOOKS[index].point;position=starts[index];
  if(transport)transport.seek(position);paint();
  if(autoplay&&transport?.state!=='playing')void playJourney();
}

function selectTrack(index){
  enterExplore();selectedTrack=index;currentIndex=TRACKS[index].chapter;scene.focus(index);paint();
  $('chapter-card').focus({preventScroll:true});
}

function waveform(position){
  const canvas=$('waveform'),rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  const width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,width,height);
  const total=durations.reduce((a,b)=>a+b,0);let start=0;
  chapters.forEach((chapter,index)=>{
    const samples=peaks[chapter.id]||[],duration=durations[index];
    for(let i=0;i<samples.length;i++){
      const x=(start+i/samples.length*duration)/total*width;
      const bar=Math.max(2,samples[i]/255*height*.88);
      ctx.fillStyle=(start+i/samples.length*duration)<=position?'#ceb48b':'#54604c';
      ctx.fillRect(x,(height-bar)/2,Math.max(1,width/650),bar);
    }
    start+=duration;
    if(index<chapters.length-1){ctx.fillStyle='#20291e';ctx.fillRect(start/total*width-2,0,4,height);}
  });
}

function paint(){
  if(!chapters||!scene)return;
  const actual=transport?transport.position:position;
  const location=locateTime(durations,actual);
  if(mode==='guided'){currentIndex=location.index;selectedTrack=LOOKS[currentIndex].point;}
  const chapter=chapters[currentIndex],look=LOOKS[currentIndex];let track=TRACKS[selectedTrack];
  const local=mode==='guided'?location.local:0,cue=cueAt(chapter,local),cueIndex=chapter.cues.indexOf(cue);
  const energySamples=peaks[chapter.id]||[];
  const amplitude=mode==='guided'&&transport?.state==='playing'?(energySamples[Math.min(energySamples.length-1,Math.floor(local/durations[currentIndex]*energySamples.length))]||0)/255:0;
  document.documentElement.style.setProperty('--accent',look.color);
  scene.reduced=reduced;
  let camera=cameraAt(look.views,local,reduced);
  if(mode==='guided'&&selectedChoice&&currentIndex===6&&local>=14){const chosen=TRACKS[selectedChoice.track];selectedTrack=selectedChoice.track;track=chosen;camera={x:chosen.x,y:chosen.y,zoom:1.7,rotation:0};}
  scene.update({camera,chapter:currentIndex,time:local,energy:amplitude,selected:selectedTrack,mode});
  $('card-index').textContent=pad(mode==='explore'?track.number:currentIndex+1);
  $('card-region').textContent=mode==='explore'?track.region.toUpperCase():look.name;
  const headline=mode==='explore'?track.title:look.headline;
  $('card-headline').replaceChildren();headline.split('\n').forEach((line,i)=>{if(i)$('card-headline').append(document.createElement('br'));$('card-headline').append(document.createTextNode(line));});
  $('card-copy').textContent=mode==='explore'?track.note:NOTES[currentIndex][cueIndex];
  $('scene-caption').textContent=mode==='explore'?'ALBUM TRACK / IMAGINED PLACE':cue.scene.replaceAll('-',' ').toUpperCase();
  $('scene-counter').textContent=`${pad(currentIndex+1)} / 07`;
  const anchored=LOOKS.some(item=>item.point===selectedTrack);
  $('play-selected').hidden=mode!=='explore'||!anchored;
  $('map-coordinate').textContent=`SECTOR ${pad(track.number)} / ${track.region.toUpperCase()}`;
  document.querySelectorAll('.chapter-link').forEach((node,index)=>node.setAttribute('aria-current',String(index===currentIndex)));
  const playing=transport?.state==='playing';
  $('play-icon').setAttribute('href',playing?'#i-pause':'#i-play');$('play').setAttribute('aria-label',playing?'Pause journey':'Play journey');
  $('playback-state').textContent=playing?'NOW PLAYING':transport?.state==='ended'?'JOURNEY COMPLETE':mode==='explore'?'EXPLORING · AUDIO PAUSED':started?'PAUSED':'READY TO EXPLORE';
  const playingIndex=location.index;
  $('now-track').textContent=chapters[playingIndex].trackTitle;
  $('now-chapter').textContent=`${pad(playingIndex+1)} · ${chapters[playingIndex].title}`;
  $('elapsed').textContent=format(actual);$('seek').value=String(actual);
  $('seek').setAttribute('aria-valuetext',`${format(actual)} of ${format(location.total)}; ${chapters[playingIndex].title}`);
  $('journey-progress').textContent=started?`${pad(playingIndex+1)} / 07 · ${chapters[playingIndex].title.toUpperCase()}`:'SEVEN CHAPTERS / ONE JOURNEY';
  $('choices').hidden=!(mode==='guided'&&((currentIndex===5&&local>=58)||currentIndex===6||transport?.state==='ended'));
  waveform(actual);
}

function scheduleFrame(){cancelAnimationFrame(frame);if(transport?.state==='playing')frame=requestAnimationFrame(()=>{paint();scheduleFrame();});}

async function init(){
  const [sheet,waveforms]=await Promise.all([getJSON('./audio-cues.json'),getJSON('./waveforms.json')]);
  chapters=sheet.chapters;durations=chapters.map(chapter=>chapter.sourceOut-chapter.sourceIn);let sum=0;starts=durations.map(duration=>{const start=sum;sum+=duration;return start;});peaks=waveforms;
  $('seek').max=String(sum);$('duration').textContent=format(sum);$('motion').checked=reduced;
  scene=new AtlasScene($('map'),selectTrack,()=>{enterExplore();paint();});
  $('chapter-card').tabIndex=-1;
  chapters.forEach((chapter,index)=>{
    const button=document.createElement('button');button.className='chapter-link';button.setAttribute('aria-label',`${chapter.title}, ${chapter.trackTitle}, ${format(durations[index])}`);
    for(const [className,text] of [['chapter-number',pad(index+1)],['chapter-name',chapter.title],['chapter-length',format(durations[index])]]){const span=document.createElement('span');span.className=className;span.textContent=text;button.append(span);}
    button.addEventListener('click',()=>jumpChapter(index));$('chapter-list').append(button);
  });
  TRACKS.forEach((track,index)=>{
    const button=document.createElement('button');button.className='track-index-item';
    const number=document.createElement('span');number.textContent=pad(track.number);const name=document.createElement('strong');name.textContent=track.title;
    const region=document.createElement('span');region.textContent=track.region;const status=document.createElement('small');status.textContent=LOOKS.some(look=>look.point===index)?'PASSAGE':'EXPLORE';
    button.append(number,name,region,status);button.addEventListener('click',()=>{$('atlas-dialog').close();selectTrack(index);});$('track-index').append(button);
  });
  CHOICES.forEach(choice=>{const button=document.createElement('button');button.textContent=choice.name;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{selectedChoice=choice;document.querySelectorAll('#choice-buttons button').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));$('choice-caption').textContent=choice.caption;notify(`${choice.name}. ${choice.caption}`);paint();});$('choice-buttons').append(button);});
  $('enter').addEventListener('click',()=>void playJourney());$('play').addEventListener('click',()=>void playJourney());
  $('silent-explore').addEventListener('click',()=>{enterExplore();scene.overview();paint();});
  $('previous').addEventListener('click',()=>jumpChapter(locateTime(durations,transport?.position??position).index-1));
  $('next').addEventListener('click',()=>jumpChapter(locateTime(durations,transport?.position??position).index+1));
  $('replay').addEventListener('click',()=>jumpChapter(locateTime(durations,transport?.position??position).index));
  $('play-selected').addEventListener('click',()=>jumpChapter(TRACKS[selectedTrack].chapter,true));
  $('return-journey').addEventListener('click',()=>{setMode('guided');scene.mode='guided';paint();void playJourney();});
  for(const id of ['overview','map-home'])$(id).addEventListener('click',()=>{enterExplore();scene.overview();paint();});
  $('zoom-in').addEventListener('click',()=>scene.zoom(1.25));$('zoom-out').addEventListener('click',()=>scene.zoom(.8));
  $('seek').addEventListener('pointerdown',()=>{scrubResume=transport?.state==='playing';transport?.pause();});
  $('seek').addEventListener('input',()=>{markStarted();setMode('guided');scene.mode='guided';position=Number($('seek').value);transport?.seek(position);paint();});
  const finishScrub=()=>{if(scrubResume){scrubResume=false;void playJourney();}};
  $('seek').addEventListener('change',finishScrub);$('seek').addEventListener('pointerup',finishScrub);$('seek').addEventListener('pointercancel',()=>{scrubResume=false;});
  $('volume').addEventListener('input',()=>{muted=false;$('mute').setAttribute('aria-pressed','false');$('mute').setAttribute('aria-label','Mute audio');transport?.setVolume(Number($('volume').value));});
  $('mute').addEventListener('click',()=>{muted=!muted;transport?.setVolume(muted?0:Number($('volume').value));$('mute').setAttribute('aria-pressed',String(muted));$('mute').setAttribute('aria-label',muted?'Unmute audio':'Mute audio');});
  $('atlas-open').addEventListener('click',()=>{$('atlas-dialog').showModal();});$('about-open').addEventListener('click',()=>{$('about-dialog').showModal();});
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
  $('motion').addEventListener('change',()=>{reduced=$('motion').checked;paint();});
  $('choose-audio').addEventListener('click',()=>$('audio-files').click());
  $('audio-files').addEventListener('change',async()=>{
    const files=[...$('audio-files').files];if(!files.length)return;
    const normalize=value=>value.toLowerCase().replace(/[^a-z0-9]/g,'');
    const sources=chapters.map(chapter=>{
      const prepared=files.find(file=>normalize(file.name).includes(normalize(chapter.id))&&/\.wav$/i.test(file.name));
      if(prepared)return {file:prepared,prepared:true};
      const title=normalize(chapter.trackTitle),original=files.find(file=>normalize(file.name).includes(title));
      return original?{file:original,prepared:false}:null;
    });
    const missing=chapters.filter((_,index)=>!sources[index]);
    if(missing.length){notify(`Select all seven passages. Missing: ${missing.map(chapter=>chapter.trackTitle).join(', ')}.`,true);return;}
    transport?.pause();localSources=sources;loadingGeneration++;loading=null;const request=++playIntent;
    try{const player=await prepareSources(sources);if(player&&request===playIntent){markStarted();setMode('guided');scene.mode='guided';await player.play();}}catch(error){notify(error.message,true);$('audio-status').textContent='Audio setup needs attention';}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(loading||transport?.state==='playing')){playIntent++;transport?.pause();notify('Journey paused while you were away. Press play to continue.');}});
  document.addEventListener('keydown',event=>{if(event.code==='Space'&&!['INPUT','BUTTON','A','TEXTAREA'].includes(document.activeElement?.tagName)&&!document.querySelector('dialog[open]')){event.preventDefault();void playJourney();}});
  window.addEventListener('resize',paint);
  paint();
  localSources=chapters.map(chapter=>({url:new URL(chapter.audio,document.baseURI).href,prepared:true}));
  $('audio-status').textContent='Soundtrack included · 7 passages';
  // Diagnostics expose timing/state, never the user's files or audio bytes.
  window.utopia={snapshot:()=>({mode,state:transport?.state||'unloaded',time:transport?.position??position,chapter:locateTime(durations,transport?.position??position).index,camera:{...scene.camera},selectedTrack,reduced,choice:selectedChoice?.name||null})};
}

init().catch(error=>{$('audio-status').textContent='The atlas could not initialize';notify(error.message,true);console.error(error);});
