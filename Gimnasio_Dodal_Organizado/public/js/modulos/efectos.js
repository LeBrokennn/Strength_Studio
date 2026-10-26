// ---- Aparición suave al hacer scroll + contadores
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');io.unobserve(t);if(t.dataset.n)count(t)}),{threshold:.12});
function count(t){const n=+t.dataset.n;let s;const f=ts=>{s??=ts;const p=Math.min((ts-s)/1200,1);t.textContent=Math.round(n*p)+(t.dataset.s||'');if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const obs=()=>$$('.rv:not(.in)').forEach(e=>io.observe(e));
const fx=()=>{$$('.grid').forEach(g=>[...g.children].forEach((c,i)=>c.style.setProperty('--i',i)));obs()};
