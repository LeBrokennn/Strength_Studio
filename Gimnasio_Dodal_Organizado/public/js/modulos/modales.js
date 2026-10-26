// ---- Ventana (carrito / reservas)
const sheet=h=>{$('#sb').innerHTML='<button class="x" aria-label="Cerrar">✕</button>'+h;$('#sheet').classList.add('open')};
const form=(id,extra='')=>`<form id="${id}" ${extra}><input name="name" placeholder="Tu nombre" required><input name="phone" type="tel" placeholder="Tu WhatsApp o teléfono" required><input name="email" type="email" placeholder="Correo (opcional)"><input name="note" placeholder="Comentario (opcional)"><button class="btn">Enviar</button></form>`;
function openCart(){
  const it=Object.entries(cart).map(([id,q])=>({p:P.find(x=>x.id===id),q})).filter(i=>i.p),tot=it.reduce((a,i)=>a+i.q*i.p.price,0);
  sheet(it.length?`<h3>Tu pedido</h3>${it.map(i=>`<div class="line"><span>${esc(i.p.name)}</span><span class="qty"><button data-d="-1" data-id="${i.p.id}">−</button>${i.q}<button data-d="1" data-id="${i.p.id}">+</button></span><b>${money(i.q*i.p.price)}</b></div>`).join('')}<p class="tot">Total <b>${money(tot)}</b></p><p class="mut">No se paga en la web: coordinas el pago por WhatsApp.</p>${form('of')}`:'<h3>Tu carrito está vacío</h3><p class="mut">Agrega productos desde la tienda.</p>');
}
$('#cartbtn').onclick=openCart;
$('#sheet').onclick=e=>{
  if(e.target.id==='sheet'||e.target.closest('.x'))return $('#sheet').classList.remove('open');
  const b=e.target.closest('[data-d]');if(!b)return;const id=b.dataset.id,q=(cart[id]||0)+ +b.dataset.d,p=P.find(x=>x.id===id);
  if(q>+p.stock)return toast('No hay más stock');q<=0?delete cart[id]:cart[id]=q;keep();upd();openCart();
};
$('#sheet').onsubmit=e=>{e.preventDefault();e.target.id==='of'?send({type:'pedido',items:Object.entries(cart).map(([id,qty])=>({id,qty}))},e.target):send({type:'reserva',slotId:e.target.dataset.slot},e.target)};
function upd(){const n=Object.values(cart).reduce((a,b)=>a+b,0),c=$('#cc');c.textContent=n;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}
async function send(body,f){
  const r=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(new FormData(f)),...body})}).then(r=>r.json());
  if(r.error)return toast(r.error);
  if(r.type==='pedido'){cart={};keep();upd()}
  const msg=r.type==='pedido'?`Hola! Soy ${r.name}. Hice el pedido #${r.id}:\n${r.items.map(i=>`${i.qty}x ${i.name}`).join('\n')}\nTotal: ${money(r.total)}`:`Hola! Soy ${r.name}. Reservé una hora particular (#${r.id}) el ${fmt(r.date_slot)} a las ${r.time_slot}`;
  sheet(`<div class="ok"><div class="check">✓</div><h3>¡Recibido! #${r.id}</h3><p class="mut">Ya avisamos al gimnasio. Confirma por WhatsApp para coordinar.</p><a class="btn" target="_blank" rel="noopener" href="${wa(msg)}">Confirmar por WhatsApp</a></div>`);
  data();
}
