-- Ejecuta todo este archivo en Supabase > SQL Editor.

-- 1. Categoría de cupones
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

-- 2. Tabla de publicidad
create table if not exists public.publicidades (
  id bigint generated always as identity primary key,
  titulo text not null,
  descripcion text default '',
  imagen_url text not null,
  enlace text not null,
  activo boolean not null default true,
  orden integer not null default 0,
  clics integer not null default 0,
  fecha_creacion timestamptz not null default now()
);

alter table public.publicidades enable row level security;

-- 3. Función segura para contar clics
create or replace function public.incrementar_clic_publicidad(p_id bigint)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  nuevo_total integer;
begin
  update public.publicidades
  set clics = coalesce(clics, 0) + 1
  where id = p_id
    and activo = true
  returning clics into nuevo_total;

  if nuevo_total is null then
    raise exception 'Publicidad no encontrada o inactiva';
  end if;

  return nuevo_total;
end;
$$;

revoke all
on function public.incrementar_clic_publicidad(bigint)
from public, anon, authenticated;

grant execute
on function public.incrementar_clic_publicidad(bigint)
to service_role;

-- 4. Bucket público para imágenes
insert into storage.buckets (id, name, public)
values ('publicidad', 'publicidad', true)
on conflict (id)
do update set public = true;

create index if not exists publicidades_activo_orden_idx
on public.publicidades (activo, orden);
