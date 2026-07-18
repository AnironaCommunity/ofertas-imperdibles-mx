-- Ejecutar una sola vez en Supabase > SQL Editor

alter table public.cupones
add column if not exists categoria text not null default 'tienda';

update public.cupones
set categoria = 'tienda'
where categoria is null or trim(categoria) = '';

alter table public.cupones
drop constraint if exists cupones_categoria_check;

alter table public.cupones
add constraint cupones_categoria_check
check (categoria in ('tienda', 'bancarios'));

create index if not exists cupones_categoria_activo_idx
on public.cupones (categoria, activo);
