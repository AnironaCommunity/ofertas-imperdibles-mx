-- Ejecutar una sola vez en Supabase > SQL Editor

alter table public.publicidades
  add column if not exists categoria text not null default 'ofertas_dia';

update public.publicidades
set categoria = 'ofertas_dia'
where categoria is null or btrim(categoria) = '';

alter table public.publicidades
  drop constraint if exists publicidades_categoria_check;

alter table public.publicidades
  add constraint publicidades_categoria_check
  check (categoria in ('ofertas_dia', 'comunidad_anirona', 'ofertas_amazon'));

create index if not exists publicidades_categoria_activo_orden_idx
  on public.publicidades (categoria, activo, orden, id);
