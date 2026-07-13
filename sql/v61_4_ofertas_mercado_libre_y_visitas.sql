-- V61.4 — Nueva sección Mercado Libre y contador de visitas.
-- Este archivo es idempotente: puede ejecutarse más de una vez.

alter table public.publicidades
  add column if not exists visitas integer not null default 0;

update public.publicidades
set visitas = 0
where visitas is null or visitas < 0;

alter table public.publicidades
  drop constraint if exists publicidades_categoria_check;

alter table public.publicidades
  add constraint publicidades_categoria_check
  check (categoria in (
    'ofertas_dia',
    'ofertas_amazon',
    'ofertas_mercado_libre',
    'comunidad_anirona'
  ));

create index if not exists publicidades_categoria_activo_orden_idx
  on public.publicidades (categoria, activo, orden, id);

create or replace function public.incrementar_visita_publicidad(p_id bigint)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  total integer;
begin
  update public.publicidades
     set visitas = greatest(coalesce(visitas, 0), 0) + 1
   where id = p_id
   returning visitas into total;

  if total is null then
    raise exception 'Publicidad no encontrada';
  end if;

  return total;
end;
$$;

revoke all on function public.incrementar_visita_publicidad(bigint) from public;
revoke all on function public.incrementar_visita_publicidad(bigint) from anon;
revoke all on function public.incrementar_visita_publicidad(bigint) from authenticated;
grant execute on function public.incrementar_visita_publicidad(bigint) to service_role;
