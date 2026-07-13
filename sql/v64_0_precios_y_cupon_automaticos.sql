
-- OFERTAS IMPERDIBLES MX V64.0
-- Campos para consulta y actualización automática de precios.
-- Seguro para ejecutar más de una vez.

ALTER TABLE public.publicidades
ADD COLUMN IF NOT EXISTS ml_item_id text;

ALTER TABLE public.publicidades
ADD COLUMN IF NOT EXISTS actualizar_precio_auto boolean NOT NULL DEFAULT false;

ALTER TABLE public.publicidades
ADD COLUMN IF NOT EXISTS precio_actualizado_en timestamptz;

CREATE INDEX IF NOT EXISTS publicidades_ml_item_id_idx
ON public.publicidades (ml_item_id);

CREATE INDEX IF NOT EXISTS publicidades_actualizar_precio_auto_idx
ON public.publicidades (actualizar_precio_auto)
WHERE actualizar_precio_auto = true;

COMMENT ON COLUMN public.publicidades.ml_item_id IS
'Identificador de la publicación de Mercado Libre, por ejemplo MLM123456789.';

COMMENT ON COLUMN public.publicidades.actualizar_precio_auto IS
'Indica si el precio y el cupón recomendado deben actualizarse automáticamente.';

COMMENT ON COLUMN public.publicidades.precio_actualizado_en IS
'Fecha y hora de la última consulta automática exitosa.';
