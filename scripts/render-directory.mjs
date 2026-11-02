import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await readFile(resolve(root,'directory/days.json'),'utf8'));
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cards=manifest.days.map(day=>{
 const complete=day.status==='complete', number=String(day.day).padStart(2,'0');
 const source=manifest.repository+'/tree/'+manifest.branch+'/day'+day.day;
 const hosted=manifest.pagesBase+'day'+day.day+'/';
 const tags=(day.tags||[]).map(tag=>'<span>'+escape(tag)+'</span>').join('');
 return '<article class="day-card '+(complete?'is-complete':'is-planned')+'" data-status="'+escape(day.status)+'" data-search="'+escape([day.theme,day.title,day.description,...(day.tags||[])].join(' ').toLowerCase())+'">'+
 '<div class="day-card-top"><span class="day-number">'+number+'</span><span class="status-badge '+day.status+'">'+(complete?'Complete':'Planned')+'</span></div>'+
 '<p class="day-date">NOVEMBER '+number+' · '+escape(day.theme)+'</p>'+
 '<h3>'+escape(day.title)+'</h3><p class="day-description">'+escape(day.description)+'</p>'+
 (tags?'<div class="day-tags">'+tags+'</div>':'<p class="planned-note">Map concept to be selected.</p>')+
 '<div class="day-links"><a class="page-link" href="../day'+day.day+'/" title="GitHub Pages: '+hosted+'">'+(complete?'Open map':'Day page')+' <span aria-hidden="true">↗</span><small>GITHUB PAGES</small></a>'+
 '<a href="'+source+'" target="_blank" rel="noopener noreferrer" aria-label="Source code for Day '+day.day+'">Source ↗</a><a href="../day'+day.day+'/readme.md">Notes</a></div></article>';
}).join('\n');
const template=await readFile(resolve(root,'directory/template.html'),'utf8');
const html=template.replaceAll('{{COMPLETE_COUNT}}',String(manifest.days.filter(d=>d.status==='complete').length))
 .replaceAll('{{PLANNED_COUNT}}',String(manifest.days.filter(d=>d.status==='planned').length)).replace('{{DAY_CARDS}}',cards);
await writeFile(resolve(root,'directory/index.html'),html);
console.log('Rendered the directory with '+manifest.days.length+' daily entries.');

