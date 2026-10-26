// ---- Datos
const MES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const ymd=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const now=new Date();let cy=now.getFullYear(),cm=now.getMonth(),sel=ymd(cy,cm,now.getDate());
const dayActs=(y,m,d)=>{const w=(new Date(y,m,d).getDay()+6)%7;return A.filter(x=>x.day==w).sort((a,b)=>a.time.localeCompare(b.time))};
function cal(){
  const first=(new Date(cy,cm,1).getDay()+6)%7,n=new Date(cy,cm+1,0).getDate(),today=ymd(now.getFullYear(),now.getMonth(),now.getDate());
  let h=`<div class="calh"><button data-m="-1" aria-label="Mes anterior">‹</button><h3>${MES[cm]} ${cy}</h3><button data-m="1" aria-label="Mes siguiente">›</button></div><div class="cg">${['L','M','M','J','V','S','D'].map(d=>`<b>${d}</b>`).join('')}`+'<span></span>'.repeat(first);
  for(let d=1;d<=n;d++){const k=ymd(cy,cm,d),as=dayActs(cy,cm,d);
    h+=`<button class="cd${k===sel?' sel':''}${k===today?' today':''}${as.length?'':' off'}" data-day="${k}"><span>${d}</span>${as.slice(0,2).map(a=>`<small>${esc(a.time)} ${esc(a.name)}</small>`).join('')}${as.length>2?`<small>+${as.length-2} más</small>`:''}<u>${as.map(()=>'<i></i>').join('')}</u></button>`}
  $('#calendar').innerHTML=h+'</div><div id="dd"></div>';detail();
}
function detail(){
  const [y,m,d]=sel.split('-').map(Number),as=dayActs(y,m-1,d);
  $('#dd').innerHTML=`<h3 class="dh">${fmt(sel)}</h3>`+(as.map(a=>`<div class="cls"><button class="clsh" data-c><b>${esc(a.time)}</b><span>${esc(a.name)}</span><em>${esc(a.coach)}</em><i>＋</i></button><div class="cb"><div><p>${esc(a.desc||'Clase guiada por nuestro equipo.')}</p><div class="chips"><span>${esc(a.duration||'60 min')}</span><span>${esc(a.level||'Todos los niveles')}</span><span>${esc(a.coach)}</span></div><a class="btn" target="_blank" rel="noopener" href="${wa(`Hola! Quiero reservar cupo en ${a.name} el ${fmt(sel)} a las ${a.time}`)}">Reservar cupo</a></div></div></div>`).join('')||'<p class="mut">Día de descanso</p>');
}
$('#calendar').onclick=e=>{
  const m=e.target.closest('[data-m]');if(m){cm+=+m.dataset.m;if(cm<0){cm=11;cy--}if(cm>11){cm=0;cy++}return cal()}
  const d=e.target.closest('[data-day]');if(d){sel=d.dataset.day;$$('.cd').forEach(x=>x.classList.toggle('sel',x===d));return detail()}
  const c=e.target.closest('[data-c]');if(c)c.parentElement.classList.toggle('open');
};
function addCart(id){const p=P.find(x=>x.id===id),q=(cart[id]||0)+1;if(q>+p.stock)return toast('No hay más stock');cart[id]=q;keep();upd();toast('✓ '+p.name+' agregado')}
addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)addCart(b.dataset.add)});
const prod=x=>{const l=+x.stock,bd=l<=0?'<em class="bd out">Agotado</em>':l<=5?`<em class="bd low">Últimas ${l}</em>`:'<em class="bd">Disponible</em>';
  return `<article class="card prod rv"><div class="pi" data-q="${x.id}"><img src="${esc(x.image||'img/p1.svg')}" alt="${esc(x.name)}" loading="lazy">${bd}</div><div class="b"><h3>${esc(x.name)}</h3><p class="mut">${esc(x.desc)}</p><div class="pf"><span class="price">${money(x.price)}</span></div><button class="btn ${l>0?'':'off'}" data-add="${x.id}">${l>0?'Agregar al pedido':'No disponible'}</button></div></article>`};
$('#products').onclick=e=>{const c=e.target.closest('[data-q]');if(!c)return;const x=P.find(i=>i.id===c.dataset.q);
  sheet(`<img class="tph" src="${esc(x.image||'img/p1.svg')}" alt=""><h3>${esc(x.name)}</h3><p class="mut">${esc(x.desc)}</p><p class="tot">Precio <b>${money(x.price)}</b></p><button class="btn ${+x.stock>0?'':'off'}" data-add="${x.id}">+ Agregar al carrito</button>`)};
$('#team').onclick=e=>{const c=e.target.closest('[data-t]');if(!c)return;const x=T.find(i=>i.id===c.dataset.t);
  sheet(`<img class="tph" src="${esc(x.image||'img/t1.svg')}" alt="${esc(x.name)}"><h3>${esc(x.name)}</h3><span class="role">${esc(x.role)}</span><p>${esc(x.bio)}</p><h4>Formación profesional</h4><p class="mut">${esc(x.studies)}</p><div class="chips">${(x.specialties||'').split(',').filter(s=>s.trim()).map(s=>`<span>${esc(s.trim())}</span>`).join('')}</div><br><a class="btn" target="_blank" rel="noopener" href="${wa('Hola! Quiero agendar una hora con '+x.name)}">Agendar con ${esc(x.name.split(' ')[0])}</a>`)};
async function data(){
  const [p,a,s,t]=await Promise.all([api('products'),api('activities'),api('slots'),api('trainers')]);P=p;A=a;T=t;
  $('#products').innerHTML=p.map(prod).join('')||'<p class="mut">Pronto habrá productos.</p>';
  $('#team').innerHTML=t.map(x=>`<article class="card pro rv" data-t="${x.id}"><img src="${esc(x.image||'img/t1.svg')}" alt="${esc(x.name)}" loading="lazy"><div class="b"><h3>${esc(x.name)}</h3><span class="role">${esc(x.role)}</span><div class="chips">${(x.specialties||'').split(',').filter(s=>s.trim()).slice(0,3).map(s=>`<span>${esc(s.trim())}</span>`).join('')}</div><span class="more">Ver perfil y agendar</span></div></article>`).join('')||'<p class="mut">Pronto presentaremos a nuestro equipo.</p>';
  cal();
  const today=new Date().toISOString().slice(0,10),g={};
  s.filter(x=>!x.booked&&x.date>=today).sort((m,n)=>(m.date+m.time).localeCompare(n.date+n.time)).forEach(x=>(g[x.date]??=[]).push(x));
  $('#slots').innerHTML=Object.keys(g).map(d=>`<h3>${fmt(d)}</h3><div class="slots">${g[d].map(x=>`<button class="btn sec" data-slot="${x.id}" data-date="${d}" data-time="${esc(x.time)}">${esc(x.time)}</button>`).join('')}</div>`).join('')||'<p class="mut">No hay horas libres por ahora. Escríbenos por WhatsApp.</p>';
  fx();
}
$('#slots').onclick=e=>{const b=e.target.closest('[data-slot]');if(!b)return;sheet(`<h3>Reservar hora</h3><p class="mut">${fmt(b.dataset.date)} · ${b.dataset.time}</p>${form('bf','data-slot="'+b.dataset.slot+'"')}`)};
