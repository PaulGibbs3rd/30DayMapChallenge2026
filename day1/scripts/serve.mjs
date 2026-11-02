import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.geojson':'application/geo+json','.png':'image/png','.jpg':'image/jpeg','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost'), path=resolve(root,'.'+decodeURIComponent(url.pathname));
 if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}
 let target=path;
 if((await stat(target)).isDirectory())target=resolve(target,'index.html');
 res.setHeader('Content-Type',types[extname(target)]||'application/octet-stream');
 res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 res.end(await readFile(target));
 }catch{res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));

