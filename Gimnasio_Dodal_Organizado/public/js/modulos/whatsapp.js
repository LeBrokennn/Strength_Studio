// ---- Chat de WhatsApp
const QR=[['Planes y precios','Hola! Quiero saber los planes y precios'],['Agendar hora','Hola! Quiero agendar una hora particular'],['Consultar un producto','Hola! Quiero consultar por un producto'],['Hablar con una persona','Hola! Quiero hablar con una persona']];
const isOpen=()=>{const d=new Date(),w=d.getDay(),m=d.getHours()*60+d.getMinutes();return w>=1&&w<=5?m>=390&&m<1320:w===6&&m>=540&&m<840};
const hm=()=>new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'});
const say=(t,me)=>{const m=document.createElement('div');m.className='m '+(me?'me':'bot');m.innerHTML=`<span>${esc(t)}</span><time>${hm()}</time>`;$('#wc').append(m);$('#wc').scrollTop=1e5};
const st=$('#wst');st.textContent=isOpen()?'En línea · Responde en minutos':'Fuera de horario · Te respondemos al abrir';st.classList.toggle('on',isOpen());
let chatOn=0;
$('#fab').onclick=()=>{$('#hint').classList.remove('show');const o=$('#wp').classList.toggle('open');if(o&&!chatOn){chatOn=1;const d=document.createElement('div');d.className='m bot dots';d.innerHTML='<i></i><i></i><i></i>';$('#wc').append(d);
  setTimeout(()=>{d.remove();say('Hola, somos el equipo de '+cfg.name+'. ¿En qué podemos ayudarte?');if(!isOpen())say('Ahora estamos fuera de horario, pero puedes dejarnos tu mensaje y te respondemos apenas abramos.');$('#wq').innerHTML=QR.map((q,i)=>`<button data-q="${i}">${q[0]}</button>`).join('')},800)}};
$('#wx').onclick=()=>$('#wp').classList.remove('open');
$('#wq').onclick=e=>{const b=e.target.closest('[data-q]');if(!b)return;const q=QR[b.dataset.q];say(q[0],1);say('Perfecto, te abrimos WhatsApp con tu mensaje listo.');open(wa(q[1]),'_blank')};
$('#wf').onsubmit=e=>{e.preventDefault();const v=$('#wi').value.trim();if(!v)return;say(v,1);say('Perfecto, te abrimos WhatsApp con tu mensaje listo.');open(wa(v),'_blank');$('#wi').value=''};
setTimeout(()=>!$('#wp').classList.contains('open')&&$('#hint').classList.add('show'),3500);
