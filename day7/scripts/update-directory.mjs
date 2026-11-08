import {readFile,writeFile} from 'node:fs/promises';
const path='directory/days.json';
const data=JSON.parse(await readFile(path,'utf8'));
const day=data.days.find(d=>d.day===7);
Object.assign(day,{title:'Seven Days of Shaking',description:'Explore a week of USGS-reported earthquakes around the Pacific and beyond, with magnitude-sized circles and clickable event details. Built in a ten-minute working window.',status:'complete',image:'../day7/earthquake-preview.jpg',tags:['ArcGIS JavaScript','Calcite','USGS','Earthquakes','10 minute map']});
await writeFile(path,JSON.stringify(data,null,2)+'\n');
