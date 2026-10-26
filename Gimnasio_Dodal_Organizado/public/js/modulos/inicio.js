// ---- Inicio
route();upd();ico();
function today(){const n=new Date(),as=dayActs(n.getFullYear(),n.getMonth(),n.getDate()),s=$('#tstat'),o=isOpen();
  s.textContent=o?'Abierto ahora':'Cerrado';s.classList.toggle('on',o);
  $('#today').innerHTML=as.map(a=>`<div class="tr"><b>${esc(a.time)}</b><span>${esc(a.name)}<small>${esc(a.coach)}</small></span></div>`).join('')||'<p class="mut">Hoy no hay clases programadas. Revisa la agenda de los próximos días.</p>'}
(async()=>{try{cfg=await api('config')}catch(e){console.error(e)}
  document.title=cfg.name;$$('.gname').forEach(e=>e.textContent=cfg.name);
  $$('[data-wa]').forEach(a=>a.href=wa(a.dataset.wa));pick('pesas');
  try{await data()}catch(e){console.error(e)}
  today();ico()})();
