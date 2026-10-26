// ---- Mapa interactivo
$('#plan').innerHTML=ZONES.map(z=>`<g class="zn" data-id="${z.id}" tabindex="0"><rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="12"/><text x="${z.x+z.w/2}" y="${z.y+z.h/2}" text-anchor="middle" dominant-baseline="middle">${z.n}</text></g>`).join('');
function pick(id){const z=ZONES.find(x=>x.id===id);$$('.zn').forEach(g=>g.classList.toggle('sel',g.dataset.id===id));
  $('#zone').innerHTML=`<div class="zp"><img src="img/${z.img}.svg" alt="${z.n}"><div class="b"><h3>${z.n}</h3><p class="mut">${z.d}</p><div class="chips">${z.t.map(t=>`<span>${t}</span>`).join('')}</div><a class="btn sec" target="_blank" rel="noopener" href="${wa('Hola! Quiero saber más de la zona: '+z.n)}">Consultar por esta zona</a></div></div>`}
$$('.zn').forEach(g=>{g.onclick=()=>pick(g.dataset.id);g.onkeydown=e=>e.key==='Enter'&&pick(g.dataset.id)});pick('pesas');
$$('.gal img').forEach(i=>i.onclick=()=>{$('#lb img').src=i.src;$('#lb').hidden=false});$('#lb').onclick=()=>$('#lb').hidden=true;
