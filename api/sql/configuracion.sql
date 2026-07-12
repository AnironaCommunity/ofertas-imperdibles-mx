-- Ejecuta este archivo en Supabase > SQL Editor.
-- Es seguro ejecutarlo aunque la tabla ya exista.

alter table public.cupones
  add column if not exists clics integer default 0;

alter table public.cupones
  add column if not exists activo boolean default true;

create or replace function public.incrementar_clic_cupon(p_id bigint)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  nuevo_total integer;
begin
  update public.cupones
  set clics = coalesce(clics, 0) + 1
  where id = p_id
    and activo = true
  returning clics into nuevo_total;

  if nuevo_total is null then
    raise exception 'Cupón no encontrado o inactivo';
  end if;

  return nuevo_total;
end;
$$;

revoke all
on function public.incrementar_clic_cupon(bigint)
from public, anon, authenticated;

grant execute
on function public.incrementar_clic_cupon(bigint)
to service_role;
