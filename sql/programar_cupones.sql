-- V50: Programación automática de cupones.
-- Ejecutar una sola vez en Supabase > SQL Editor.

alter table public.cupones
add column if not exists fecha_inicio timestamptz null;

alter table public.cupones
add column if not exists fecha_fin timestamptz null;

alter table public.cupones
drop constraint if exists cupones_fechas_validas_check;

alter table public.cupones
add constraint cupones_fechas_validas_check
check (
  fecha_inicio is null
  or fecha_fin is null
  or fecha_fin > fecha_inicio
);

create index if not exists cupones_programacion_idx
on public.cupones (activo, fecha_inicio, fecha_fin);

comment on column public.cupones.fecha_inicio
is 'Inicio automático almacenado como timestamptz. Se captura en hora de Ciudad de México.';

comment on column public.cupones.fecha_fin
is 'Finalización automática almacenada como timestamptz. Se captura en hora de Ciudad de México.';
