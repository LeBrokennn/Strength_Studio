// ---- Páginas
function route(){
  const h=location.hash.slice(1)||'inicio',pg=$('#'+h)?.classList.contains('page')?h:'inicio';
  $$('.page').forEach(p=>p.classList.toggle('on',p.id===pg));
  $$('#nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+pg));
  $$('#'+pg+' .rv').forEach(e=>e.classList.remove('in'));scrollTo({top:0,behavior:'instant'});obs();
}
addEventListener('hashchange',route);
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('on',x===b));$$('.tp').forEach(p=>p.classList.toggle('on',p.id===b.dataset.t))});
