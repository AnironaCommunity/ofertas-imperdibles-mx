# Auditoría V69.0 LTS — Ofertas Imperdibles MX

## Objetivo
Ordenar y estabilizar el proyecto sin modificar su interfaz ni su funcionamiento visible.

## Correcciones aplicadas

- Se consolidaron `base.css`, `coupons.css`, `schedule.css` y `header.css` en `css/style.css`, respetando exactamente el orden anterior de la cascada.
- Se consolidaron los ajustes finales de cabecera, etiquetas y tema en `css/estabilidad.css`.
- Se eliminaron los controles antiguos del carrusel Mercado Libre/Amazon. Ya no eran visibles y el menú actual es una cuadrícula fija.
- Se eliminó el JavaScript muerto asociado a flechas, indicador y desplazamiento horizontal del menú.
- Se añadieron invariantes estructurales para impedir desbordamientos horizontales de los contenedores principales.
- Se eliminaron copias duplicadas, parches antiguos, estilos no cargados y un ZIP histórico incrustado dentro del proyecto.
- Se actualizaron las versiones de caché de los recursos públicos a `69.0.0`.

## Validaciones realizadas

- Sintaxis válida en todos los archivos JavaScript públicos, administrativos y API.
- Sin identificadores HTML duplicados.
- Sin referencias locales rotas de CSS, JavaScript o imágenes.
- Sin controles del carrusel antiguo referenciados en HTML o JavaScript.
- La interfaz conserva las mismas reglas CSS y el mismo orden de aplicación.

## Base de datos

Esta versión no agrega tablas ni columnas. No requiere ejecutar SQL en Supabase.
