const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],api=u=>fetch('/api/'+u).then(r=>r.json());
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),money=n=>'$'+Number(n).toLocaleString('es-CL');
const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const ZONES=[
 {id:'pesas',n:'Pesas libres',img:'pesas',x:10,y:10,w:160,h:110,d:'Racks, barras olímpicas y mancuernas para trabajar fuerza con espacio de sobra.',t:['Mancuernas 2–50 kg','Racks','Banco regulable','Barras olímpicas']},
 {id:'cardio',n:'Cardio',img:'cardio',x:180,y:10,w:100,h:110,d:'Equipos de cardio con pantalla, frente a ventanales y bien ventilados.',t:['Trotadoras','Bicicletas','Elípticas','Remo']},
 {id:'funcional',n:'Funcional',img:'funcional',x:10,y:130,w:130,h:110,d:'Zona abierta con piso de goma para circuitos, HIIT y movilidad.',t:['Kettlebells','TRX','Cuerdas','Cajones']},
 {id:'clase',n:'Sala de clases',img:'clase',x:150,y:130,w:130,h:110,d:'Sala con espejos y sonido para boxeo, yoga, spinning y crossfit.',t:['Boxeo','Yoga','Spinning','Crossfit']},
 {id:'camarines',n:'Camarines',img:'camarines',x:290,y:10,w:100,h:230,d:'Duchas con agua caliente, casilleros y baños siempre limpios.',t:['Duchas','Casilleros','Baños']}];
let cfg={whatsapp:'',name:'Strength Studio'},P=[],T=[],A=[],cart={};try{cart=JSON.parse(localStorage.cart||'{}')}catch{}
const wa=t=>`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(t)}`;
const fmt=d=>new Date(d+'T00:00').toLocaleDateString('es-CL',{weekday:'long',day:'numeric',month:'long'});
const keep=()=>{try{localStorage.cart=JSON.stringify(cart)}catch{}};
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;$('#toasts').append(d);setTimeout(()=>d.remove(),2600)}
// Íconos de línea (se insertan en cualquier elemento con data-i="nombre")
const IC={bag:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',chat:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',shield:'<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3 8 3z"/><path d="m9 12 2 2 4-4"/>',dumbbell:'<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3.5 9v6"/><path d="M20.5 9v6"/><path d="M6.5 12h11"/>',cal:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',check:'<path d="M20 6 9 17l-5-5"/>'};
const ico=()=>$$('[data-i]:not(.ic)').forEach(e=>{e.classList.add('ic');e.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${IC[e.dataset.i]||''}</svg>`});
