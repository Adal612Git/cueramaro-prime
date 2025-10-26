-- Seed content mirrored from apps/api/prisma/seed.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  name text NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  base_price numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Lots table (inventory batches)
CREATE TABLE IF NOT EXISTS lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  lot_code text UNIQUE,
  weight_kg numeric(10,3) NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Clients
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sales
CREATE TABLE IF NOT EXISTS ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  items jsonb NOT NULL,
  total numeric(12,2) DEFAULT 0
);

-- Accounts receivable
CREATE TABLE IF NOT EXISTS cxc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id uuid UNIQUE REFERENCES ventas(id) ON DELETE CASCADE,
  amount_due numeric(12,2) NOT NULL,
  due_date date NOT NULL DEFAULT (now() + interval '7 days'),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed products (5)
INSERT INTO products (id, sku, name, base_price)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'RES-001', 'Res', 180.00),
  ('10000000-0000-0000-0000-000000000002', 'CER-001', 'Cerdo', 140.00),
  ('10000000-0000-0000-0000-000000000003', 'POL-001', 'Pollo', 110.00),
  ('10000000-0000-0000-0000-000000000004', 'CHO-001', 'Chorizo', 160.00),
  ('10000000-0000-0000-0000-000000000005', 'PES-001', 'Pescado', 190.00)
ON CONFLICT (id) DO NOTHING;

-- Seed clients (3)
INSERT INTO clientes (id, name, email, phone) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Juan Pérez', 'juan@example.com', '555-1001'),
  ('20000000-0000-0000-0000-000000000002', 'María López', 'maria@example.com', '555-1002'),
  ('20000000-0000-0000-0000-000000000003', 'Carlos Gómez', 'carlos@example.com', '555-1003')
ON CONFLICT (id) DO NOTHING;

-- Seed lots (5)
INSERT INTO lots (id, product_id, lot_code, weight_kg, unit_price) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'RES-LOT-001', 12.500, 185.00),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'CER-LOT-001', 20.000, 145.00),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'POL-LOT-001', 18.750, 112.00),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'CHO-LOT-001', 10.000, 165.00),
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'PES-LOT-001', 8.250, 195.00)
ON CONFLICT (id) DO NOTHING;

