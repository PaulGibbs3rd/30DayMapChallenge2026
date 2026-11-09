import {TRACKS,LOOKS} from './world.js';

const WORLD={width:1600,height:1000};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
function hash(x,y){let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y),u=ease(x-ix),v=ease(y-iy);return lerp(lerp(hash(ix,iy),hash(ix+1,iy),u),lerp(hash(ix,iy+1),hash(ix+1,iy+1),u),v);}
function fbm(x,y){return noise(x,y)*.55+noise(x*2.03+17,y*2.03+9)*.27+noise(x*4.11+3,y*4.11+21)*.13+noise(x*8.19,y*8.19)*.05;}
const gauss=(x,y,cx,cy,sx,sy)=>Math.exp(-((x-cx)**2/sx**2+(y-cy)**2/sy**2)*1.7);
function elevation(x,y){
  const nx=x/1600,ny=y/1000;
  let h=-.31+1.0*gauss(nx,ny,.45,.47,.37,.46)+.57*gauss(nx,ny,.68,.42,.23,.26);
  h+=.46*gauss(nx,ny,.81,.72,.105,.12)+.32*gauss(nx,ny,.91,.56,.055,.075)+.32*gauss(nx,ny,.87,.84,.06,.07);
  h+=(fbm(nx*6+11,ny*6+13)-.5)*.44;
  const ridge=1-Math.abs(fbm(nx*5+2,ny*5+8)*2-1);
  h+=ridge*.24*gauss(nx,ny,.44,.38,.37,.38);
  const river=.74+.055*Math.sin(nx*15)-.23*Math.exp(-(((nx-.58)/.15)**2));
  h-=Math.exp(-(((ny-river)/.024)**2))*.13*gauss(nx,ny,.53,.68,.3,.4);
  return h;
}

function makeTerrain(){
  const width=1100,height=688,field=new Float32Array(width*height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)field[y*width+x]=elevation(x/width*1600,y/height*1000);
  const bitmap=document.createElement('canvas');bitmap.width=width;bitmap.height=height;
  const ctx=bitmap.getContext('2d'),pixels=ctx.createImageData(width,height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const i=y*width+x,h=field[i],dx=field[y*width+Math.min(width-1,x+1)]-h,dy=field[Math.min(height-1,y+1)*width+x]-h;
    const shade=clamp(.83-dx*49-dy*57,.38,1.36),grain=(hash(x,y)-.5)*6;
    let r,g,b;
    if(h<0){const deep=clamp((h+.3)/.3,0,1);r=lerp(12,32,deep);g=lerp(22,42,deep);b=lerp(23,40,deep);}
    else{const high=clamp(h/.96,0,1);r=lerp(68,154,high)*shade;g=lerp(63,133,high)*shade;b=lerp(46,101,high)*shade;}
    pixels.data[i*4]=clamp(r+grain,0,255);pixels.data[i*4+1]=clamp(g+grain,0,255);pixels.data[i*4+2]=clamp(b+grain,0,255);pixels.data[i*4+3]=255;
  }
  ctx.putImageData(pixels,0,0);
  const contours=[],step=8;
  for(let level=0;level<1.1;level+=.045){
    const path=new Path2D();
    for(let y=0;y<1000-step;y+=step)for(let x=0;x<1600-step;x+=step){
      const coords=[[x,y],[x+step,y],[x+step,y+step],[x,y+step]];
      const vals=coords.map(([px,py])=>field[Math.min(height-1,Math.floor(py/1000*height))*width+Math.min(width-1,Math.floor(px/1600*width))]);
      const crossings=[];
      for(let edge=0;edge<4;edge++){const next=(edge+1)%4;if((vals[edge]<level)!==(vals[next]<level)){const t=(level-vals[edge])/(vals[next]-vals[edge]);crossings.push([lerp(coords[edge][0],coords[next][0],t),lerp(coords[edge][1],coords[next][1],t)]);}}
      for(let i=0;i+1<crossings.length;i+=2){path.moveTo(...crossings[i]);path.lineTo(...crossings[i+1]);}
    }
    contours.push({level,path});
  }
  return {bitmap,contours};
}

export class AtlasScene {
  constructor(canvas,onSelect,onExplore){
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});
    this.terrain=makeTerrain();this.camera={x:760,y:500,zoom:1,rotation:0};this.manual={...this.camera};
    this.chapter=0;this.time=0;this.energy=0;this.selected=5;this.mode='overview';this.focusPoints=[];this.onSelect=onSelect;this.onExplore=onExplore;
    this.drag=null;this.moved=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.drag={x:e.clientX,y:e.clientY,camera:{...this.camera}};this.moved=false;canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{
      if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>5){if(!this.moved){this.onExplore();this.manual={...this.drag.camera};this.mode='explore';}this.moved=true;const c=this.drag.camera,s=this.scale(c);this.manual={...c,x:c.x-(dx*Math.cos(c.rotation)+dy*Math.sin(c.rotation))/s,y:c.y-(-dx*Math.sin(c.rotation)+dy*Math.cos(c.rotation))/s};this.render();}}
      else{const rect=canvas.getBoundingClientRect(),hit=this.hit(e.clientX-rect.left,e.clientY-rect.top);canvas.style.cursor=hit?'pointer':'grab';}
    });
    canvas.addEventListener('pointerup',e=>{if(!this.moved){const rect=canvas.getBoundingClientRect(),hit=this.hit(e.clientX-rect.left,e.clientY-rect.top);if(hit)this.onSelect(hit.number-1);}this.drag=null;});
    canvas.addEventListener('pointercancel',()=>{this.drag=null;});
    canvas.addEventListener('wheel',e=>{e.preventDefault();const saved={...this.camera};this.onExplore();this.manual=saved;this.mode='explore';this.manual.zoom=clamp(this.manual.zoom*Math.exp(-e.deltaY*.001),.65,4.5);this.render();},{passive:false});
    canvas.addEventListener('keydown',e=>{const deltas={ArrowLeft:[-65,0],ArrowRight:[65,0],ArrowUp:[0,-65],ArrowDown:[0,65]};if(deltas[e.key]){e.preventDefault();const saved={...this.camera};this.onExplore();this.manual=saved;this.mode='explore';this.manual.x+=deltas[e.key][0]/this.manual.zoom;this.manual.y+=deltas[e.key][1]/this.manual.zoom;this.render();}});
    this.resize();
  }
  resize(){const rect=this.canvas.getBoundingClientRect();this.width=rect.width;this.height=rect.height;this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*this.dpr);this.canvas.height=Math.round(this.height*this.dpr);this.render();}
  scale(c=this.camera){return Math.max(this.width/1550,this.height/1000)*c.zoom;}
  toScreen(x,y){const c=this.camera,s=this.scale(),dx=x-c.x,dy=y-c.y;return [this.width*.55+(dx*Math.cos(c.rotation)-dy*Math.sin(c.rotation))*s,this.height*.49+(dx*Math.sin(c.rotation)+dy*Math.cos(c.rotation))*s];}
  hit(x,y){return [...this.focusPoints].reverse().find(point=>Math.hypot(point.sx-x,point.sy-y)<Math.max(15,point.radius));}
  update({camera,chapter,time,energy=0,selected,mode}){this.chapter=chapter;this.time=time;this.energy=energy;if(selected!==undefined)this.selected=selected;if(mode)this.mode=mode;if(this.mode==='guided')this.camera=camera;else if(this.mode==='explore')this.camera={...this.manual};this.render();}
  overview(){this.mode='explore';this.manual={x:790,y:490,zoom:.95,rotation:0};this.camera={...this.manual};this.render();}
  focus(index){const track=TRACKS[index];this.selected=index;this.mode='explore';this.manual={x:track.x,y:track.y,zoom:1.75,rotation:0};this.camera={...this.manual};this.render();}
  zoom(factor){const saved={...this.camera};this.onExplore();this.manual=saved;this.mode='explore';this.manual.zoom=clamp(this.manual.zoom*factor,.65,4.5);this.camera={...this.manual};this.render();}
  render(){
    if(!this.width||!this.terrain)return;
    if(this.mode==='explore')this.camera={...this.manual};
    const ctx=this.ctx,w=this.width,h=this.height,color=LOOKS[this.chapter].color;
    ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.fillStyle='#101b1c';ctx.fillRect(0,0,w,h);
    ctx.save();const c=this.camera,scale=this.scale();ctx.translate(w*.55,h*.49);ctx.rotate(c.rotation);ctx.scale(scale,scale);ctx.translate(-c.x,-c.y);
    ctx.drawImage(this.terrain.bitmap,0,0,WORLD.width,WORLD.height);
    ctx.globalCompositeOperation='soft-light';ctx.fillStyle=color;ctx.globalAlpha=.13;ctx.fillRect(0,0,1600,1000);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    for(const contour of this.terrain.contours){ctx.strokeStyle=contour.level===0?'#9b9c7a':'#c5ae7a';ctx.globalAlpha=contour.level===0?.32:.1;ctx.lineWidth=(contour.level===0?1.05:.5)/Math.sqrt(scale);ctx.stroke(contour.path);}ctx.globalAlpha=1;
    ctx.strokeStyle='rgba(204,190,145,.08)';ctx.lineWidth=.6/scale;ctx.beginPath();for(let x=0;x<=1600;x+=100){ctx.moveTo(x,0);ctx.lineTo(x,1000)}for(let y=0;y<=1000;y+=100){ctx.moveTo(0,y);ctx.lineTo(1600,y)}ctx.stroke();
    this.landmarks(ctx,scale,color);
    const anchors=LOOKS.map(look=>TRACKS[look.point]);
    ctx.setLineDash([4/scale,7/scale]);ctx.lineWidth=.85/scale;ctx.strokeStyle='rgba(228,202,153,.32)';ctx.beginPath();anchors.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.setLineDash([]);
    if(this.chapter>0){ctx.strokeStyle=color;ctx.globalAlpha=.7;ctx.lineWidth=1.1/scale;ctx.beginPath();anchors.slice(0,this.chapter+1).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.globalAlpha=1;}
    const names=[['THE HIGHLANDS',650,120],['THE AMPHITHEATRE',1030,210],['THE QUIET COUNTRY',695,860],['THE UNMOORINGS',1330,820],['THE ECHO FIELDS',390,390]];
    ctx.fillStyle='rgba(226,209,169,.4)';ctx.font='10px ui-monospace,monospace';ctx.textAlign='center';ctx.letterSpacing='3px';
    for(const [name,x,y] of names)ctx.fillText(name,x,y);ctx.letterSpacing='0px';
    ctx.restore();
    const veil=ctx.createRadialGradient(w*.56,h*.47,0,w*.56,h*.47,Math.max(w,h)*.72);veil.addColorStop(0,'rgba(12,15,14,0)');veil.addColorStop(.55,'rgba(12,15,14,.04)');veil.addColorStop(1,'rgba(7,10,9,.75)');ctx.fillStyle=veil;ctx.fillRect(0,0,w,h);
    this.focusPoints=[];
    for(const track of TRACKS){
      const [x,y]=this.toScreen(track.x,track.y);if(x<0||x>w||y<0||y>h)continue;
      const active=track.number-1===this.selected,anchor=LOOKS.some(look=>look.point===track.number-1),r=active?6:anchor?3.5:2;
      this.focusPoints.push({...track,sx:x,sy:y,radius:r});
      if(active){const pulse=this.reduced?0:this.energy;const glow=ctx.createRadialGradient(x,y,2,x,y,45+pulse*25);glow.addColorStop(0,color+'66');glow.addColorStop(1,color+'00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,45+pulse*25,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,13+pulse*5,0,Math.PI*2);ctx.stroke();}
      ctx.fillStyle=active?'#f8e6c6':anchor?'#c6b28a':'#898872';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      if(anchor||active||scale>1.2){ctx.font=`${active?'600':'400'} ${active?12:9}px ui-monospace,monospace`;ctx.textAlign='left';ctx.fillStyle=active?'#f1dec0':'rgba(226,215,186,.63)';ctx.shadowColor='#131b17';ctx.shadowBlur=5;ctx.fillText(`${String(track.number).padStart(2,'0')}  ${track.title}`,x+19,y+4);ctx.shadowBlur=0;}
    }
    // The first chapter's aperture opens on the same audio timeline as the map.
    if(this.mode==='guided'&&this.chapter===0&&this.time<25){const shut=1-clamp((this.time-10)/15,0,1);if(shut>0){ctx.fillStyle=`rgba(9,11,10,${.72*shut})`;const side=w*.19*shut;ctx.fillRect(0,0,side,h);ctx.fillRect(w-side,0,side,h);ctx.strokeStyle=`rgba(218,190,144,${.15*shut})`;ctx.lineWidth=1;ctx.strokeRect(side,38,w-2*side,h-76);}}
  }
  landmarks(ctx,scale,color){
    ctx.strokeStyle='rgba(218,190,141,.45)';ctx.lineWidth=.9/scale;
    // Arena plan: concentric terraces and radial entries.
    ctx.save();ctx.translate(1015,330);ctx.rotate(-.2);
    for(let r=27;r<=85;r+=11){ctx.beginPath();ctx.ellipse(0,0,r,r*.62,0,0,Math.PI*2);ctx.stroke();}
    for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(a)*27,Math.sin(a)*17);ctx.lineTo(Math.cos(a)*85,Math.sin(a)*53);ctx.stroke();}ctx.restore();
    // The room and its approach.
    ctx.strokeRect(338,640,54,37);ctx.strokeRect(345,647,40,23);ctx.beginPath();ctx.moveTo(366,677);ctx.lineTo(366,705);ctx.lineTo(420,705);ctx.stroke();
    // A river traces the refuge, with braided channels.
    ctx.strokeStyle='rgba(155,181,158,.64)';ctx.lineWidth=2.1/scale;ctx.beginPath();ctx.moveTo(620,620);ctx.bezierCurveTo(700,610,730,720,825,725);ctx.bezierCurveTo(940,730,960,825,1110,860);ctx.stroke();
    ctx.strokeStyle='rgba(141,175,153,.24)';ctx.lineWidth=6/scale;ctx.stroke();
    // An observatory, a summit, and an unfinished departure road.
    ctx.strokeStyle=color+'88';ctx.lineWidth=.9/scale;
    ctx.beginPath();ctx.arc(685,440,30,0,Math.PI*2);ctx.moveTo(640,440);ctx.lineTo(730,440);ctx.moveTo(685,395);ctx.lineTo(685,485);ctx.stroke();
    ctx.beginPath();ctx.moveTo(649,207);ctx.lineTo(675,163);ctx.lineTo(701,207);ctx.closePath();ctx.stroke();
    ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(345,295);ctx.lineTo(270,228);ctx.moveTo(345,295);ctx.lineTo(355,195);ctx.moveTo(345,295);ctx.lineTo(435,235);ctx.stroke();ctx.setLineDash([]);
  }
}
