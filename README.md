# Ofertas Imperdibles MX — V60 estabilizada

Esta versión conserva el diseño y las funciones de la versión anterior,
pero reorganiza los estilos para reducir el riesgo de perder cambios
cuando se agreguen nuevas funciones.

## Estructura principal

- `index.html`: página pública.
- `css/style.css`: punto de entrada de estilos.
- `css/base.css`: estructura general, modal y publicidad.
- `css/coupons.css`: tarjetas, botones, navegación y diseño móvil.
- `css/schedule.css`: programación, estados y contador de vencimiento.
- `css/header.css`: logo, redes sociales y contadores superiores.
- `js/app.js`: funcionamiento público.
- `admin/`: panel unificado de administración.
- `api/`: funciones de Vercel para Supabase.
- `sql/`: actualizaciones de base de datos.

## Funciones conservadas

- Cupones de Tienda y Bancarios.
- Dos tarjetas por fila en teléfono.
- Etiqueta Popular.
- Me gusta y contador.
- Compartir la página sin revelar el código.
- Estado “Ya usaste este cupón”.
- Programación por fecha y hora de Ciudad de México.
- Activación y finalización automáticas.
- Franja inferior con tiempo restante.
- Publicidad rotativa administrable.
- Precios y cupón oculto en publicidad.
- Redes sociales.
- Resumen de Cupones, Bancarios y Copiados.
- Panel unificado de Cupones y Publicidad.

## Regla para próximos cambios

Para modificar una sección, edita únicamente su módulo CSS:

- Tarjetas: `css/coupons.css`
- Programación: `css/schedule.css`
- Cabecera: `css/header.css`
- Publicidad y estructura general: `css/base.css`

No agregues nuevos parches al final de `style.css`.
