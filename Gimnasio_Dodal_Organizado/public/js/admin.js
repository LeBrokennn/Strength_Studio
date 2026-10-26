const $=s=>document.querySelector(s);let T=sessionStorage.token;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const call=async(u,m='GET',b)=>{
  const o={method:m,headers:{'x-token':T||''}};
  if(b instanceof FormData)o.body=b;else if(b){o.headers['Content-Type']='application/json';o.body=JSON.stringify(b)}
  const r=await fetch('/api/'+u,o);
  if(r.status===401){sessionStorage.clear();T=null;gate()}
  return r.json();
};
const S={
  products:{t:'Productos',f:[['name','Nombre'],['price','Precio','number'],['stock','Stock','number'],['desc','Descripción'],['image','Imagen','file']],row:x=>`${esc(x.name)} · $${esc(x.price)} · stock ${esc(x.stock)}`},
  activities:{t:'Actividades semanales',f:[['day','Día','day'],['time','Hora','time'],['name','Actividad'],['coach','Profesor'],['desc','Descripción de la clase','text',1],['duration','Duración (ej. 60 min)','text',1],['level','Nivel','text',1]],row:x=>`${DAYS[x.day]} ${esc(x.time)} · ${esc(x.name)}`},
  slots:{t:'Horas particulares',f:[['date','Fecha','date'],['time','Hora','time']],row:x=>`${esc(x.date)} ${esc(x.time)} ${x.booked?'(reservada)':'(libre)'}`}
  ,trainers:{t:'Profesionales',f:[['name','Nombre'],['role','Título (ej. Kinesiólogo)'],['studies','Formación profesional'],['specialties','Especialidades (separadas por coma)','text',1],['bio','Descripción'],['image','Foto','file']],row:x=>`${esc(x.name)} · ${esc(x.role)}`},orders:{t:'Pedidos y reservas',f:[],row:x=>`${x.type==='reserva'?'📅':'🛒'} #${esc(x.id)} · ${esc(x.name)} · ${esc(x.phone)} · ${x.items?x.items.map(i=>i.qty+'x '+esc(i.name)).join(', ')+' = $'+x.total:esc(x.slot)} ${x.booked?'✓ atendido':'● nuevo'}`}
};
async function render(k){
  const s=S[k],list=await call(k);if(!Array.isArray(list))return;
  $('#panel').innerHTML=`<h2>${s.t}</h2><form id="f" ${s.f.length?'':'hidden'}>${s.f.map(([n,l,t='text',o])=>`<label>${l}${t==='day'?`<select name="${n}">${DAYS.map((d,i)=>`<option value="${i}">${d}</option>`).join('')}</select>`:`<input name="${n}" type="${t}" ${t==='file'?'accept="image/*"':o?'':'required'}>`}</label>`).join('')}<button class="btn">Agregar</button></form><div id="l">${list.map(x=>`<div class="row"><span>${s.row(x)}</span><span>${k==='products'?`<button class="btn sec" data-a="e" data-id="${x.id}">Stock</button> `:k==='slots'?`<button class="btn sec" data-a="e" data-id="${x.id}">${x.booked?'Liberar':'Marcar reservada'}</button> `:k==='orders'?`<button class="btn sec" data-a="e" data-id="${x.id}">${x.booked?'Reabrir':'Atendido'}</button> `:''}<button class="btn sec" data-a="d" data-id="${x.id}">Eliminar</button></span></div>`).join('')}</div>`;
  $('#l').onclick=async e=>{
    const b=e.target.closest('button');if(!b)return;const x=list.find(i=>i.id===b.dataset.id);
    if(b.dataset.a==='d'){if(!confirm('¿Eliminar?'))return;await call(k+'/'+x.id,'DELETE')}
    else if(k==='products'){const v=prompt('Nuevo stock',x.stock);if(v===null)return;await call(k+'/'+x.id,'PUT',{stock:+v})}
    else await call(k+'/'+x.id,'PUT',{booked:!x.booked});
    render(k);
  };
  $('#f').onsubmit=async e=>{e.preventDefault();await call(k,'POST',new FormData(e.target));render(k)};
}
function gate(){$('#login').hidden=!!T;$('#app').hidden=!T;$('#tabs').hidden=!T}
$('#login').onsubmit=async e=>{
  e.preventDefault();
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:e.target.p.value})}).then(r=>r.json());
  if(r.token){T=r.token;sessionStorage.token=T;gate();render('products')}else alert(r.error);
};
document.querySelectorAll('#tabs a').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('#tabs a').forEach(n=>n.classList.remove('active'));a.classList.add('active');render(a.dataset.k)});
gate();if(T)render('products');
