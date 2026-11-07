import type {Level} from './levels';

export function drawScene(canvas:HTMLCanvasElement,level:Level,index:number){
 const c=canvas.getContext('2d')!;
 c.imageSmoothingEnabled=false;
 const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 rect(0,0,240,104,'#0b1027');
 // All illustrations use an integer grid; no external images.
 for(let i=0;i<48;i++){
  const x=(i*71+index*13)%240,y=(i*31)%65;
  rect(x,y,i%5===0?2:1,1,i%3?'#4d667e':'#b1d6ca');
 }
 rect(182,15,18,18,'#41345d');rect(178,19,26,10,'#41345d');
 rect(184,17,12,12,'#827095');
 for(let x=0;x<240;x+=4){
  const ridge=58+Math.round(Math.sin(x*.045+index)*9+Math.sin(x*.09)*6);
  rect(x,ridge,4,88-ridge,'#17303e');
 }
 if(level.art==='mountain'){
  for(let y=27;y<88;y+=3){
   const half=Math.floor((y-27)*.95/3)*3;
   rect(120-half,y,Math.max(6,half*2),3,y<43?'#bddece':y<58?'#629f97':'#2b6668');
  }
  rect(113,27,14,3,'#f3e9ce');
  for(let y=83;y<104;y+=4)rect(25+(y%3)*4,y,190,1,'#274858');
 }else if(level.art==='temple'){
  for(let tier=0;tier<3;tier++){
   const y=36+tier*15,half=18+tier*10;
   rect(120-half,y,half*2,3,'#ba6c93');rect(116-half,y+3,half*2+8,3,'#f296ae');
   rect(125-half,y+6,half*2-10,10,'#27384d');
   rect(116,y+7,4,7,'#f5d186');rect(125,y+7,4,7,'#f5d186');
  }
  rect(119,19,2,18,'#a7c6a9');rect(115,26,10,2,'#a7c6a9');
  rect(79,83,82,3,'#63887b');
 }else if(level.art==='forest'){
  for(let i=0;i<12;i++){
   const x=6+i*21,y=31+(i*17)%25;
   for(let k=0;k<6;k++)rect(x-k*2,y+k*5,k*4+4,5,i%2?'#2b796b':'#439a7c');
   rect(x, y+25,3,23,'#796c66');
  }
  for(let i=0;i<18;i++)rect((i*43)%240,88+(i*11)%16,3,1,'#89b88c');
 }else if(level.art==='island'){
  rect(0,75,240,29,'#103c4c');
  for(let i=0;i<12;i++)rect((i*31)%220,78+(i*7)%23,18,1,'#38747a');
  for(let x=30;x<215;x+=3){const h=12+Math.sin(x*.03)*7;rect(x,77-h,3,h,'#578e7d');}
  rect(59,41,4,30,'#b7b586');
  rect(42,38,20,3,'#89cca2');rect(61,35,21,3,'#89cca2');rect(49,32,13,3,'#89cca2');rect(62,29,12,3,'#89cca2');
  rect(153,59,24,12,'#b97683');rect(147,55,36,4,'#dd9c91');
 }else{
  for(let i=0;i<17;i++){
   const x=i*15-3,h=10+(i*37+index*11)%35;
   rect(x,86-h,12,h,'#243e51');rect(x,86-h,12,2,'#3d6b74');
   for(let y=90-h;y<83;y+=7)for(let k=0;k<2;k++)rect(x+3+k*5,y,2,2,(i+k)%3?'#91ccaa':'#df8ca6');
  }
  if(level.id==='hiroshima'){
   rect(107,64,28,22,'#729e9c');rect(111,59,20,5,'#8cb8ad');rect(115,54,12,5,'#8cb8ad');
   rect(119,49,4,6,'#b9d5bc');rect(118,73,6,13,'#213445');
   for(let y=87;y<104;y+=3)rect(80-(y-87)*2,y,90+(y-87)*3,2,'#255363');
  }else{
   rect(117,25,3,61,'#a782a5');rect(108,46,21,4,'#f39aba');rect(112,39,13,7,'#5b7d8b');
   rect(114,50,9,11,'#508c8f');rect(109,80,20,6,'#75969d');
   rect(118,17,1,8,'#f5c8bc');
  }
 }
 rect(0,101,240,3,'#558f82');
 canvas.setAttribute('aria-label','Original 16-bit illustration inspired by '+level.name);
}
