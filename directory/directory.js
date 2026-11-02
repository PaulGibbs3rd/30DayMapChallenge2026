const search=document.getElementById('map-search');
const buttons=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('.day-card')];
let status='all';
function filterMaps(){
 const query=search.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
 let count=0;
 cards.forEach(card=>{
  const text=card.dataset.search.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const show=(status==='all'||card.dataset.status===status)&&text.includes(query);
  card.hidden=!show;if(show)count++;
 });
 document.getElementById('results-count').textContent=count===30?'Showing all 30 days':'Showing '+count+' of 30 days';
 document.getElementById('empty-state').hidden=count!==0;
}
search.addEventListener('input',filterMaps);
buttons.forEach(button=>button.addEventListener('click',()=>{
 status=button.dataset.filter;
 buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 filterMaps();
}));

