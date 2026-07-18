-- V40: Agregar Me gusta a los cupones.
-- Ejecutar una sola vez en Supabase > SQL Editor.

alter table public.cupones
add column if not exists likes integer not null default 0;

create or replace function public.agregar_like_cupon(p_id bigint)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  nuevo_total integer;
begin
  update public.cupones
  set likes = coalesce(likes, 0) + 1
  where id = p_id
    and activo = true
  returning likes into nuevo_total;

  if nuevo_total is null then
    raise exception 'Cupón no encontrado o inactivo';
  end if;

  return nuevo_total;
end;
$$;

create or replace function public.quitar_like_cupon(p_id bigint)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  nuevo_total integer;
begin
  update public.cupones
  set likes = greatest(coalesce(likes, 0) - 1, 0)
  where id = p_id
    and activo = true
  returning likes into nuevo_total;

  if nuevo_total is null then
    raise exception 'Cupón no encontrado o inactivo';
  end if;

  return nuevo_total;
end;
$$;

revoke all
on function public.agregar_like_cupon(bigint)
from public, anon, authenticated;

revoke all
on function public.quitar_like_cupon(bigint)
from public, anon, authenticated;

grant execute
on function public.agregar_like_cupon(bigint)
to service_role;

grant execute
on function public.quitar_like_cupon(bigint)
to service_role;
