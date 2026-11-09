import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';

const day=resolve(import.meta.dirname,'..');
const clips=resolve(import.meta.dirname,'.local/clips');
const port=Number(process.argv[2]||process.env.UTOPIA_PORT||4188);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.wav':'audio/wav','.mp3':'audio/mpeg','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const isInside=(file,root)=>file===root||file.startsWith(root+sep);
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    const path=decodeURIComponent(url.pathname).replace(/^\/30DayMapChallenge2026(?=\/|$)/,'').replace(/^\/day8(?=\/|$)/,'')||'/';
    if(path==='/__audio/status'){
      const rendered=JSON.parse(await readFile(resolve(import.meta.dirname,'.local/rendered-clips.json'),'utf8'));
      for(const clip of rendered)await stat(resolve(clips,clip.file));
      res.writeHead(200,{'content-type':types['.json'],'cache-control':'no-store'});res.end(JSON.stringify({available:true,clips:rendered.map(({id,file,duration})=>({id,file,duration}))}));return;
    }
    let file;
    if(path.startsWith('/__audio/')){
      const name=path.slice('/__audio/'.length);
      if(!/^\d{2}-[a-z-]+\.wav$/.test(name))throw Object.assign(new Error('Not found'),{code:'ENOENT'});
      file=resolve(clips,name);
      if(!isInside(file,clips))throw new Error('Forbidden');
    }else{
      const relative=path.replace(/^\/30DayMapChallenge2026\/day8\/?/,'/').replace(/^\/day8\/?/,'/');
      if(relative.split('/').some(part=>part==='scripts'||part.startsWith('.')))throw Object.assign(new Error('Not found'),{code:'ENOENT'});
      const root=relative.startsWith('/directory/')?resolve(day,'../directory'):day;
      const localPath=root===day?relative:relative.slice('/directory'.length);
      file=resolve(root,'.'+(localPath==='/'?'/index.html':localPath));
      if(!isInside(file,root))throw new Error('Forbidden');
    }
    const info=await stat(file);if(!info.isFile())throw Object.assign(new Error('Not found'),{code:'ENOENT'});
    const headers={'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'};
    const match=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(match){
      const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),info.size-1):info.size-1;
      if(start>end||start>=info.size){res.writeHead(416,{'content-range':`bytes */${info.size}`});res.end();return;}
      res.writeHead(206,{...headers,'content-range':`bytes ${start}-${end}/${info.size}`,'content-length':end-start+1});if(req.method==='HEAD')res.end();else createReadStream(file,{start,end}).pipe(res);
    }else{res.writeHead(200,{...headers,'content-length':info.size});if(req.method==='HEAD')res.end();else createReadStream(file).pipe(res);}
  }catch(error){res.writeHead(error.code==='ENOENT'?404:400,{'content-type':'text/plain'});res.end('Not available');}
});
server.listen(port,'127.0.0.1',()=>console.log(`UTOPIA local prototype: http://127.0.0.1:${port}/`));
