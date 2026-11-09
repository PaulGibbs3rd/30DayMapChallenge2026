import test from 'node:test';
import assert from 'node:assert/strict';
import {JourneyTransport,locateTime,cameraAt,cueAt} from '../timeline.js';

class AudioContextDouble {
  constructor(){this.currentTime=0;this.destination={};this.nodes=[];}
  resume(){return Promise.resolve();}
  createGain(){return {gain:{value:0,setTargetAtTime(){}},connect(){},disconnect(){}};}
  createBufferSource(){const node={connect(){},disconnect(){},stop(){this.stopped=true;},start(...args){this.scheduled=args;}};this.nodes.push(node);return node;}
}
const make=()=>{const context=new AudioContextDouble();return {context,player:new JourneyTransport(context,[{},{},{}],[34.4,54,43])};};
test('chapter boundaries, end position, and invalid seeks are unambiguous',()=>{
  assert.equal(locateTime([34.4,54,43],34.4).index,1);
  assert.equal(locateTime([34.4,54,43],88.4).index,2);
  assert.equal(locateTime([34.4,54,43],999).local,43);
  assert.equal(locateTime([34.4,54,43],-5).position,0);
  assert.equal(locateTime([34.4,54,43],NaN).position,0);
  assert.equal(locateTime([34.4,54,43],54.9).local,20.5);
});
test('all chapter audio is scheduled contiguously against one epoch',async()=>{
  const {context,player}=make();await player.play();
  assert.deepEqual(context.nodes.map(node=>node.scheduled),[[.025,0,34.4],[34.425,0,54],[88.42500000000001,0,43]]);
  context.currentTime=12.025;assert.equal(player.position,12);
});
test('pause freezes experience time and resume starts at that audio offset',async()=>{
  const {context,player}=make();await player.play();context.currentTime=9.025;player.pause();
  const frozen=player.position;context.currentTime=40;assert.equal(player.position,frozen);
  await player.play();assert.equal(context.nodes.at(-3).scheduled[1],9);
  context.currentTime=45.025;assert.equal(player.position,14);
});
test('seeking during playback cancels old sources and rebuilds the remaining schedule',async()=>{
  const {context,player}=make();await player.play();const stale=[...context.nodes];
  player.seek(54.4);assert.ok(stale.every(node=>node.stopped));
  assert.equal(player.state,'playing');assert.equal(player.position,54.4);
  assert.equal(context.nodes.at(-2).scheduled[1],20);
  assert.equal(context.nodes.at(-2).scheduled[2],34);
  assert.equal(context.nodes.at(-1).scheduled[0],34.025000000000006);
});
test('seeking while paused never starts playback and cue lookup supports reverse seeks',()=>{
  const {context,player}=make();player.seek(70);assert.equal(context.nodes.length,0);assert.equal(player.state,'paused');
  const chapter={cues:[{at:0,scene:'before'},{at:20.5,scene:'after'}]};
  assert.equal(cueAt(chapter,20.5).scene,'after');assert.equal(cueAt(chapter,7).scene,'before');
});
test('repeated play is idempotent and does not invalidate the completion callback',async()=>{
  const {context,player}=make();await player.play();const count=context.nodes.length;await player.play();
  assert.equal(context.nodes.length,count);context.nodes.at(-1).onended();assert.equal(player.state,'ended');assert.equal(player.position,131.4);
});
test('a stale completion callback cannot end a newly sought chapter',async()=>{
  const {context,player}=make();await player.play();const onended=context.nodes.at(-1).onended;
  player.seek(50);onended();assert.equal(player.state,'playing');assert.equal(player.position,50);
});
test('pause cancels a pending context-resume request',async()=>{
  const {context,player}=make();let resolve;context.resume=()=>new Promise(done=>{resolve=done;});
  const pending=player.play();player.pause();resolve();await pending;
  assert.equal(player.state,'paused');assert.equal(context.nodes.length,0);
});
test('camera and audio cue states are deterministic after seeking backward',()=>{
  const views=[[0,0,0,1,0],[20.5,100,50,2,.1],[35,300,90,1,0]];
  const before=cameraAt(views,12);cameraAt(views,30);assert.deepEqual(cameraAt(views,12),before);
  assert.deepEqual(cameraAt(views,20.5),{x:100,y:50,zoom:2,rotation:.1});
  assert.deepEqual(cameraAt(views,12,true),{x:0,y:0,zoom:1,rotation:0});
});
