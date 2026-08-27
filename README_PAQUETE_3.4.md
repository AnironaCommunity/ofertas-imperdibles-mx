# Paquete 3.4 — corrección quirúrgica

Base: Paquete 3.3 revertido / estado equivalente a 3.1.

Cambios exclusivos solicitados:
- Se retiraron del CSS las capas acumuladas 2.8, 2.9, 3.0 y 3.1 que seguían sobreescribiendo el talón bancario y las muescas.
- Se recuperan las muescas originales superior e inferior para todos los cupones horizontales.
- El relleno de la muesca usa el mismo blanco del fondo real de la sección, evitando el círculo gris de entregas anteriores.
- El cupón bancario deja de tener overrides posteriores para el talón derecho y vuelve a heredar el mismo componente base que Tienda y Exclusivo.
- Se reduce únicamente la escala visual del porcentaje/beneficio del cupón bancario.
- Se fuerza en Bancario el mismo borde, radio y sombra exterior del componente común.
- No se modifica JS, datos, funcionalidades, logo, textos ni estructura del lado izquierdo/central fuera del ajuste de tamaño del beneficio bancario.

Caché CSS: 82.65.0.
