-- OFERTAS IMPERDIBLES MX — V66.3
-- Puede ejecutarse varias veces.

ALTER TABLE public.publicidades
ADD COLUMN IF NOT EXISTS plataforma text NOT NULL DEFAULT 'mercadolibre';

UPDATE public.publicidades
SET plataforma = CASE
  WHEN lower(coalesce(enlace, '')) LIKE '%amazon.%'
    OR lower(coalesce(enlace, '')) LIKE '%a.co/%'
  THEN 'amazon'
  ELSE 'mercadolibre'
END
WHERE plataforma IS NULL
   OR plataforma NOT IN ('mercadolibre', 'amazon');

ALTER TABLE public.publicidades
DROP CONSTRAINT IF EXISTS publicidades_plataforma_check;

ALTER TABLE public.publicidades
ADD CONSTRAINT publicidades_plataforma_check
CHECK (plataforma IN ('mercadolibre', 'amazon'));
