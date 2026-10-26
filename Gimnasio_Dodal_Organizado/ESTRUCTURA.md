# Gimnasio Dodal — proyecto organizado

## Cómo ejecutar
1. Abre esta carpeta en VS Code.
2. En la terminal ejecuta `npm install` y luego `npm start`.
3. Visita `http://localhost:3000`.
4. Panel administrativo: `http://localhost:3000/admin.html`.

## Dónde editar cada pestaña
- `public/views/inicio.html`: Inicio.
- `public/views/espacio.html`: Espacio y galería.
- `public/views/equipo.html`: Equipo.
- `public/views/tienda.html`: Tienda.
- `public/views/clases.html`: Clases y reservas.
- `public/views/comunidad.html`: Comunidad y contacto.

## Estilos
- `public/css/styles.css`: estilos globales originales, mantenidos para conservar la apariencia.
- `public/css/views/<seccion>.css`: estilos personalizados de cada pestaña. Prefija los selectores con `#seccion`.

## JavaScript
- `public/js/modulos/base.js`: variables y utilidades compartidas.
- `efectos.js`: animaciones.
- `navegacion.js`: cambio de pestañas.
- `espacio.js`: plano del gimnasio.
- `modales.js`: carrito y formularios.
- `datos.js`: productos, entrenadores, actividades y reservas.
- `whatsapp.js`: chat y WhatsApp.
- `inicio.js`: arranque y carga inicial.
- `public/js/admin.js`: panel administrativo.

## Servidor y datos
- `server.js`: servidor Express, API y composición de vistas HTML.
- `data/`: archivos JSON de contenido.

**Importante:** las vistas HTML se insertan en el servidor antes de entregar la página. No abras `index.html` con doble clic: ejecuta Node. El servidor mantiene la API y la administración originales. Para producción, configura `ADMIN_PASSWORD` con una clave segura y revisa autenticación, archivos y datos.
