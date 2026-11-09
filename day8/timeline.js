export function locateTime(durations, time) {
  const total=durations.reduce((a,b)=>a+b,0);
  const position=Math.max(0,Math.min(total,Number.isFinite(time)?time:0));
  let start=0;
  for(let index=0;index<durations.length;index++){
    if(position<start+durations[index]||index===durations.length-1)
      return {index,local:Math.round((position-start)*1e6)/1e6,start,position,total};
    start+=durations[index];
  }
  throw new Error('The journey needs at least one chapter.');
}

export function cueAt(chapter, seconds) {
  return [...chapter.cues].reverse().find(cue=>cue.at<=seconds)||chapter.cues[0];
}

export function cameraAt(views, seconds, reduced=false) {
  let a=views[0],b=views[views.length-1];
  for(let i=0;i<views.length-1;i++)if(seconds<views[i+1][0]){a=views[i];b=views[i+1];break;}else a=views[i+1];
  const t=reduced?0:Math.max(0,Math.min(1,(seconds-a[0])/Math.max(.001,b[0]-a[0])));
  const ease=t*t*(3-2*t);
  return {x:a[1]+(b[1]-a[1])*ease,y:a[2]+(b[2]-a[2])*ease,zoom:a[3]+(b[3]-a[3])*ease,rotation:a[4]+(b[4]-a[4])*ease};
}

/** The audio context is the only clock. Seeking rebuilds all future sources. */
export class JourneyTransport extends EventTarget {
  constructor(context,buffers,durations){
    super();this.context=context;this.buffers=buffers;this.durations=durations;
    this.total=durations.reduce((a,b)=>a+b,0);this.offset=0;this.epoch=0;
    this.state='paused';this.generation=0;this.sources=[];
    this.gain=context.createGain();this.gain.gain.value=.72;this.gain.connect(context.destination);
  }
  get position(){return Math.max(0,Math.min(this.total,this.offset+(this.state==='playing'?Math.max(0,this.context.currentTime-this.epoch):0)));}
  change(){this.dispatchEvent(new Event('change'));}
  halt(){this.generation++;for(const source of this.sources){source.onended=null;try{source.stop();}catch{/* Already ended. */}source.disconnect();}this.sources=[];}
  schedule(){
    this.halt();const generation=this.generation;this.epoch=this.context.currentTime+.025;
    let start=0;
    this.buffers.forEach((buffer,index)=>{
      const duration=this.durations[index],end=start+duration;
      if(end>this.offset){
        const skipped=Math.max(0,this.offset-start),when=this.epoch+Math.max(0,start-this.offset);
        const source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.gain);
        if(index===this.buffers.length-1)source.onended=()=>{
          if(this.generation!==generation||this.state!=='playing')return;
          this.offset=this.total;this.state='ended';this.halt();this.change();
        };
        source.start(when,skipped,duration-skipped);this.sources.push(source);
      }
      start=end;
    });
  }
  async play(){
    if(this.state==='playing')return;
    const request=++this.generation;
    await this.context.resume();
    if(request!==this.generation)return;
    if(this.context.state!=='running')throw new Error('Audio is interrupted. Tap play to try again.');
    if(this.offset>=this.total)this.offset=0;
    if(this.state==='playing')return;
    this.state='playing';this.schedule();this.change();
  }
  pause(){const position=this.position;this.halt();this.offset=position;this.state='paused';this.change();}
  seek(seconds){const playing=this.state==='playing';this.halt();this.offset=locateTime(this.durations,seconds).position;this.state=this.offset>=this.total?'ended':playing?'playing':'paused';if(this.state==='playing')this.schedule();this.change();}
  setVolume(value){this.gain.gain.setTargetAtTime(Math.max(0,Math.min(1,value)),this.context.currentTime,.025);}
  destroy(){this.halt();this.gain.disconnect();this.state='paused';}
}
