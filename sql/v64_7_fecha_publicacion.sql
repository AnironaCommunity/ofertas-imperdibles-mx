-- OFERTAS IMPERDIBLES MX — V64.7
-- Es seguro ejecutar este archivo más de una vez.

ALTER TABLE public.cupones
ADD COLUMN IF NOT EXISTS fecha_publicacion timestamptz;

CREATE INDEX IF NOT EXISTS cupones_fecha_publicacion_idx
ON public.cupones (fecha_publicacion DESC);

COMMENT ON COLUMN public.cupones.fecha_publicacion IS
'Fecha y hora en que el cupón comienza a mostrarse como Nuevo durante una hora.';
