# Gimnasio Dodal – web
## Correr local
    npm install
    ADMIN_PASSWORD=tuclave WHATSAPP=569XXXXXXXX GYM_NAME="Gimnasio Dodal" npm start
- Sitio: http://localhost:3000   · Admin: http://localhost:3000/admin.html
- WHATSAPP = número con código de país, sin + ni espacios (Chile: 569XXXXXXXX).
## Estructura
- `public/css/styles.css` → todo el diseño (colores en `:root`).
- `public/js/*.js` y `server.js` → funciones.
- `data/*.json` y `public/uploads/` → productos, actividades, horas e imágenes.
## Producción
Sube a Render / Railway / VPS con las mismas variables de entorno. IMPORTANTE: activa un disco persistente para `data/` y `public/uploads/`, o se perderán al reiniciar. Usa HTTPS y una clave larga.
## Editar contenido
- Textos de Inicio, Espacio, Equipamiento, Opiniones y Contacto: `public/index.html`.
- Fotos: reemplaza los `public/img/*.svg` por tus fotos (ej. `pesas.jpg`) y cambia el nombre en `index.html`.
- Productos, actividades y horas: panel `/admin.html`.
## Pedidos, reservas y avisos (v2)
- Los pedidos y reservas se guardan en `data/orders.json` y se ven en `/admin.html` → Pedidos. Descuentan stock / bloquean la hora solos. No hay pago en línea.
- Al enviar, el cliente ve un botón "Confirmar por WhatsApp" con el resumen ya escrito.
- Aviso por correo (opcional): define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y NOTIFY_EMAIL. Siempre se imprime también en la terminal.
- Aviso 100% automático al WhatsApp del negocio requiere la API oficial (Meta Cloud API o Twilio).
