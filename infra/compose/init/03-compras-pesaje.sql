-- =========================
-- DDL: COMPRAS & PESAJE
-- =========================
CREATE TABLE IF NOT EXISTS proveedor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID NOT NULL REFERENCES proveedor(id),
  fecha TIMESTAMP DEFAULT NOW(),
  total_kg NUMERIC(10,3) DEFAULT 0,
  total_costo NUMERIC(12,2) DEFAULT 0,
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compra_id UUID REFERENCES compra(id),
  codigo_lote VARCHAR(50) UNIQUE NOT NULL,
  producto_id UUID,
  peso_kg NUMERIC(10,3) NOT NULL,
  precio_compra NUMERIC(10,2),
  fecha_caducidad DATE,
  ubicacion VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'DISPONIBLE',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lote_estado ON lote(estado);
CREATE INDEX IF NOT EXISTS idx_compra_fecha ON compra(fecha);
