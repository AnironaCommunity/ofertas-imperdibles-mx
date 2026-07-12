# Ofertas Imperdibles MX — Versión 2.0

Esta versión:

- Obtiene los cupones desde Supabase.
- Muestra el contador de usos.
- Copia el código y abre Mercado Libre con un solo botón.
- Conserva la sección de ANIRONA Official Store.
- Mantiene la llave secreta únicamente en Vercel.

## Estructura

- `index.html`: estructura de la página.
- `css/style.css`: colores y diseño.
- `js/app.js`: carga los cupones y controla los botones.
- `api/cupones.js`: consulta Supabase desde Vercel.
- `api/clic.js`: incrementa el contador.
- `sql/configuracion.sql`: prepara la función del contador.
- `img/logo.png`: logo de la página.

## Antes de publicar

### 1. Supabase

En Supabase > SQL Editor, ejecuta el archivo:

`sql/configuracion.sql`

Debe aparecer:

`Success. No rows returned`

### 2. Vercel

Confirma que existan estas variables:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Deben estar disponibles en Production y Preview.

Nunca coloques `SUPABASE_SECRET_KEY` dentro del HTML, JavaScript del navegador
o GitHub.

### 3. GitHub

Sube el contenido de esta carpeta al repositorio. Puedes reemplazar los archivos
existentes o arrastrar todas las carpetas y archivos mediante:

`Add file > Upload files`

Después presiona `Commit changes`.

Vercel detectará el commit y creará un despliegue nuevo automáticamente.

## Pruebas

Cuando Vercel indique `Ready`, abre:

`https://TU-DOMINIO.vercel.app/api/cupones`

Debe aparecer un arreglo JSON con los cupones.

Después abre la página principal y pulsa `Copiar y Canjear`.

## Administrar cupones

En Supabase > Table Editor > cupones:

- Para agregar uno: pulsa `Insert`.
- Para ocultarlo: cambia `activo` a `false`.
- Para editarlo: modifica la celda correspondiente.
- El campo `clics` se actualiza automáticamente.

Campos esperados:

- `titulo`
- `codigo`
- `compra_minima`
- `ahorro_maximo`
- `enlace`
- `clics`
- `activo`
