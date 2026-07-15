-- OFERTAS IMPERDIBLES MX — V67.15
-- Puede ejecutarse varias veces.

CREATE TABLE IF NOT EXISTS public.configuracion_web (
  id text PRIMARY KEY,
  imagen_url text NOT NULL DEFAULT '',
  color_inicio text NOT NULL DEFAULT '#e9cdff',
  color_fin text NOT NULL DEFAULT '#fae8fa',
  actualizado_en timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.configuracion_web (
  id,
  imagen_url,
  color_inicio,
  color_fin
)
VALUES (
  'hero_redes',
  '',
  '#e9cdff',
  '#fae8fa'
)
ON CONFLICT (id) DO NOTHING;
