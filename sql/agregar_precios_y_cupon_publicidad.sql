-- ACTUALIZACIÓN DE PUBLICIDAD:
-- precios y cupón oculto.
-- Ejecutar una sola vez en Supabase > SQL Editor.

alter table public.publicidades
add column if not exists precio_publicado text not null default '';

alter table public.publicidades
add column if not exists precio_cupon text not null default '';

alter table public.publicidades
add column if not exists codigo_cupon text not null default '';

comment on column public.publicidades.precio_publicado
is 'Precio visible publicado en Mercado Libre';

comment on column public.publicidades.precio_cupon
is 'Precio visible después de aplicar el cupón';

comment on column public.publicidades.codigo_cupon
is 'Código oculto que se copia al pulsar Ver en Mercado Libre';
