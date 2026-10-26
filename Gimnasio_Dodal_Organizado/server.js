const express=require('express'),fs=require('fs'),path=require('path'),multer=require('multer'),crypto=require('crypto');
const app=express(),PORT=process.env.PORT||3000,PASS=process.env.ADMIN_PASSWORD||'cambiar',WA=process.env.WHATSAPP||'56900000000';
const DATA=path.join(__dirname,'data'),UP=path.join(__dirname,'public','uploads');
fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(UP,{recursive:true});
const load=n=>{try{return JSON.parse(fs.readFileSync(path.join(DATA,n+'.json')))}catch{return[]}};
const save=(n,d)=>fs.writeFileSync(path.join(DATA,n+'.json'),JSON.stringify(d,null,2));
const upload=multer({storage:multer.diskStorage({destination:UP,filename:(q,f,cb)=>cb(null,Date.now()+path.extname(f.originalname).toLowerCase())}),limits:{fileSize:3e6},fileFilter:(q,f,cb)=>cb(null,/^image\//.test(f.mimetype))});
const TOKENS=new Set();
const auth=(q,s,n)=>TOKENS.has(q.headers['x-token'])?n():s.status(401).json({error:'No autorizado'});
// Avisos por correo (opcional): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL
const mail=process.env.SMTP_HOST?require('nodemailer').createTransport({host:process.env.SMTP_HOST,port:+process.env.SMTP_PORT||587,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}):null;
const txt=o=>`${o.type.toUpperCase()} #${o.id}\n${o.name} · ${o.phone} ${o.email||''}\n`+(o.items?o.items.map(i=>`${i.qty}x ${i.name}`).join('\n')+`\nTotal $${o.total}`:`Hora: ${o.slot}`)+(o.note?`\nNota: ${o.note}`:'');
async function notify(o){console.log('\n🔔 NUEVO '+txt(o)+'\n');if(mail&&process.env.NOTIFY_EMAIL)await mail.sendMail({from:process.env.SMTP_USER,to:process.env.NOTIFY_EMAIL,subject:`Nuevo ${o.type} #${o.id}`,text:txt(o)})}
// Las vistas están separadas en public/views y se componen al solicitar la página.
// Esto mantiene las rutas, eventos y SEO sin depender de peticiones adicionales.
const PUBLIC=path.join(__dirname,'public');
app.get('/',(req,res)=>{
  try {
    let html=fs.readFileSync(path.join(PUBLIC,'index.html'),'utf8');
    for(const name of ['inicio','espacio','equipo','tienda','clases','comunidad']){
      const view=fs.readFileSync(path.join(PUBLIC,'views',name+'.html'),'utf8');
      html=html.replace('<!-- VISTA:'+name+' -->',view);
    }
    res.type('html').send(html);
  } catch(err) { console.error('Error cargando vistas:',err);res.status(500).send('Error cargando el sitio'); }
});
app.use(express.json());app.use(express.static(PUBLIC));
app.get('/api/config',(q,s)=>s.json({whatsapp:WA,name:process.env.GYM_NAME||'Strength Studio'}));
app.post('/api/login',(q,s)=>{
  if(q.body.password!==PASS)return s.status(401).json({error:'Clave incorrecta'});
  const t=crypto.randomBytes(24).toString('hex');TOKENS.add(t);s.json({token:t});
});
['products','activities','slots','trainers'].forEach(n=>{
  app.get('/api/'+n,(q,s)=>s.json(load(n)));
  app.post('/api/'+n,auth,upload.single('image'),(q,s)=>{
    const d=load(n),it={id:crypto.randomUUID(),...q.body};
    if(q.file)it.image='/uploads/'+q.file.filename;
    d.push(it);save(n,d);s.json(it);
  });
  app.put('/api/'+n+'/:id',auth,upload.single('image'),(q,s)=>{
    const d=load(n),i=d.findIndex(x=>x.id===q.params.id);if(i<0)return s.sendStatus(404);
    d[i]={...d[i],...q.body,id:d[i].id};if(q.file)d[i].image='/uploads/'+q.file.filename;
    save(n,d);s.json(d[i]);
  });
  app.delete('/api/'+n+'/:id',auth,(q,s)=>{save(n,load(n).filter(x=>x.id!==q.params.id));s.json({ok:true})});
});
// Pedidos y reservas (sin pago online)
app.post('/api/orders',(q,s)=>{
  const b=q.body||{},name=String(b.name||'').slice(0,80),phone=String(b.phone||'').slice(0,30);
  if(!name||!phone)return s.status(400).json({error:'Falta nombre o teléfono'});
  const o={id:crypto.randomUUID().slice(0,6).toUpperCase(),date:new Date().toISOString(),type:b.type==='reserva'?'reserva':'pedido',name,phone,email:String(b.email||'').slice(0,80),note:String(b.note||'').slice(0,300),booked:false};
  if(o.type==='pedido'){
    const prods=load('products');let total=0;const items=[];
    for(const it of (b.items||[])){
      const p=prods.find(x=>x.id===it.id),n=Math.max(1,parseInt(it.qty)||1);
      if(!p||+p.stock<n)return s.status(400).json({error:'Sin stock: '+(p?p.name:'producto')});
      items.push({id:p.id,name:p.name,qty:n,price:+p.price});total+=n*p.price;
    }
    if(!items.length)return s.status(400).json({error:'Carrito vacío'});
    items.forEach(i=>{const p=prods.find(x=>x.id===i.id);p.stock=+p.stock-i.qty});save('products',prods);
    o.items=items;o.total=total;
  }else{
    const sl=load('slots'),x=sl.find(z=>z.id===b.slotId&&!z.booked);
    if(!x)return s.status(400).json({error:'Esa hora ya no está disponible'});
    x.booked=true;save('slots',sl);o.slot=x.date+' '+x.time;o.date_slot=x.date;o.time_slot=x.time;
  }
  const d=load('orders');d.unshift(o);save('orders',d);
  notify(o).catch(e=>console.log('Correo no enviado:',e.message));
  s.json(o);
});
app.get('/api/orders',auth,(q,s)=>s.json(load('orders')));
app.put('/api/orders/:id',auth,(q,s)=>{const d=load('orders'),i=d.findIndex(x=>x.id===q.params.id);if(i<0)return s.sendStatus(404);d[i]={...d[i],...q.body,id:d[i].id};save('orders',d);s.json(d[i])});
app.delete('/api/orders/:id',auth,(q,s)=>{save('orders',load('orders').filter(x=>x.id!==q.params.id));s.json({ok:true})});
app.listen(PORT,()=>console.log('http://localhost:'+PORT));
