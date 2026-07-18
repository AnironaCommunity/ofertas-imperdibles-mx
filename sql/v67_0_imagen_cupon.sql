-- OFERTAS IMPERDIBLES MX — V67.0
-- Puede ejecutarse varias veces.

ALTER TABLE public.cupones
ADD COLUMN IF NOT EXISTS imagen_url text;

COMMENT ON COLUMN public.cupones.imagen_url IS
'Logo o imagen opcional que se muestra en el encabezado de la tarjeta del cupón.';
