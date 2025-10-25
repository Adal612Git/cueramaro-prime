-- =============================================
-- MODIFICACIONES ESPECIALIZADAS PARA CARNICERÍA
-- =============================================

-- ==================== NUEVAS TABLAS PARA CARNICERÍA ====================

-- Tabla de proteínas
CREATE TABLE proteina (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de presentaciones
CREATE TABLE presentacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opciones de hueso
CREATE TABLE opcion_hueso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opciones de piel
CREATE TABLE opcion_piel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de procesamiento
CREATE TABLE procesamiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subcategorías por proteína
CREATE TABLE subcategoria_proteina (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proteina_id UUID REFERENCES proteina(id) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cortes de carne
CREATE TABLE corte (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Producto base (combinación de proteína + corte + subcategoría)
CREATE TABLE producto_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proteina_id UUID REFERENCES proteina(id) NOT NULL,
    corte_id UUID REFERENCES corte(id),
    nombre_base VARCHAR(255) NOT NULL,
    subcategoria_id UUID REFERENCES subcategoria_proteina(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Variaciones del producto (SKUs específicos)
CREATE TABLE producto_variacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_base_id UUID REFERENCES producto_base(id) NOT NULL,
    procesamiento_id UUID REFERENCES procesamiento(id),
    presentacion_id UUID REFERENCES presentacion(id) NOT NULL,
    hueso_id UUID REFERENCES opcion_hueso(id),
    piel_id UUID REFERENCES opcion_piel(id),
    lean_pct INTEGER, -- Porcentaje de magro para carnes molidas
    unidad_medida VARCHAR(10) NOT NULL DEFAULT 'KG',
    sku VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INSERTS DE DATOS MAESTROS ====================

-- Proteínas básicas
INSERT INTO proteina (nombre) VALUES
('RES'),('CERDO'),('POLLO'),('PESCADO'),('MARISCOS');

-- Presentaciones
INSERT INTO presentacion (nombre) VALUES 
('FRESCO'),('CONGELADO');

-- Opciones de hueso
INSERT INTO opcion_hueso (codigo, nombre) VALUES 
('CH','Con Hueso'),('SH','Sin Hueso');

-- Opciones de piel
INSERT INTO opcion_piel (codigo, nombre) VALUES 
('CP','Con Piel'), ('SP','Sin Piel');

-- Tipos de procesamiento
INSERT INTO procesamiento (nombre) VALUES 
('MOLIDA'),('AHUMADA'),('EMBUTIDO');

-- Subcategorías por proteína
INSERT INTO subcategoria_proteina (proteina_id, nombre) VALUES
((SELECT id FROM proteina WHERE nombre='RES'), 'Premium Steak'),
((SELECT id FROM proteina WHERE nombre='RES'), 'Guiso/Asado'),
((SELECT id FROM proteina WHERE nombre='RES'), 'Molida'),
((SELECT id FROM proteina WHERE nombre='RES'), 'Menudencia'),
((SELECT id FROM proteina WHERE nombre='RES'), 'Hueso/Caldo'),
((SELECT id FROM proteina WHERE nombre='CERDO'), 'Costillar'),
((SELECT id FROM proteina WHERE nombre='CERDO'), 'Guiso/Asado'),
((SELECT id FROM proteina WHERE nombre='CERDO'), 'Embutido'),
((SELECT id FROM proteina WHERE nombre='POLLO'), 'Entero/Piezas'),
((SELECT id FROM proteina WHERE nombre='PESCADO'), 'Filete/Entero'),
((SELECT id FROM proteina WHERE nombre='MARISCOS'), 'Varios');

-- Cortes de carne
INSERT INTO corte (nombre) VALUES
('RIB-EYE'),('TOMAHAWK'),('T-BONE'),('ARRACHERA'),('FILETE'),
('DIEZMILLO'),('CHULETA'),('BRISKET'),('BABY BACK'),('BELLY'),
('PECHO'),('COSTILLA'),('CHAMORRO'),('SUADERO'),('PALETA'),
('PULPA'),('PESCUEZO'),('CHAMBERETE'),('LENGUA'),('TUÉTANO');

-- ==================== EJEMPLOS DE PRODUCTOS BASE Y VARIACIONES ====================

-- 1) Res · Rib-eye (Premium Steak), fresco, sin hueso
INSERT INTO producto_base (proteina_id, corte_id, nombre_base, subcategoria_id)
SELECT prot.id, c.id, 'Res · Rib-eye', sc.id
FROM proteina prot, corte c, subcategoria_proteina sc
WHERE prot.nombre='RES' AND c.nombre='RIB-EYE'
  AND sc.proteina_id=prot.id AND sc.nombre='Premium Steak';

INSERT INTO producto_variacion (producto_base_id, presentacion_id, hueso_id, unidad_medida, sku)
SELECT pb.id, pr.id, oh.id, 'KG', 'RIBEYE-RES-FR-SH'
FROM producto_base pb, presentacion pr, opcion_hueso oh
WHERE pb.nombre_base='Res · Rib-eye' AND pr.nombre='FRESCO' AND oh.codigo='SH';

-- 2) Cerdo · Baby Back (Costillar), ahumada, con hueso
INSERT INTO producto_base (proteina_id, corte_id, nombre_base, subcategoria_id)
SELECT prot.id, c.id, 'Cerdo · Baby Back', sc.id
FROM proteina prot, corte c, subcategoria_proteina sc
WHERE prot.nombre='CERDO' AND c.nombre='BABY BACK'
  AND sc.proteina_id=prot.id AND sc.nombre='Costillar';

INSERT INTO producto_variacion (producto_base_id, procesamiento_id, presentacion_id, hueso_id, unidad_medida, sku)
SELECT pb.id, proc.id, pr.id, oh.id, 'KG', 'BABYBACK-CER-AH-CH'
FROM producto_base pb, procesamiento proc, presentacion pr, opcion_hueso oh
WHERE pb.nombre_base='Cerdo · Baby Back' AND proc.nombre='AHUMADA' AND pr.nombre='FRESCO' AND oh.codigo='CH';

-- 3) Res Molida 80/20 (Molida), fresco
INSERT INTO producto_base (proteina_id, corte_id, nombre_base, subcategoria_id)
SELECT prot.id, NULL, 'Res · Molida', sc.id
FROM proteina prot, subcategoria_proteina sc
WHERE prot.nombre='RES' AND sc.proteina_id=prot.id AND sc.nombre='Molida';

INSERT INTO producto_variacion (producto_base_id, procesamiento_id, presentacion_id, lean_pct, unidad_medida, sku)
SELECT pb.id, proc.id, pr.id, 80, 'KG', 'MOLIDA-RES-80-20'
FROM producto_base pb, procesamiento proc, presentacion pr
WHERE pb.nombre_base='Res · Molida' AND proc.nombre='MOLIDA' AND pr.nombre='FRESCO';

-- ==================== ÍNDICES PARA OPTIMIZACIÓN ====================

CREATE INDEX idx_producto_base_proteina ON producto_base(proteina_id);
CREATE INDEX idx_producto_base_corte ON producto_base(corte_id);
CREATE INDEX idx_producto_base_subcategoria ON producto_base(subcategoria_id);
CREATE INDEX idx_producto_variacion_base ON producto_variacion(producto_base_id);
CREATE INDEX idx_producto_variacion_sku ON producto_variacion(sku);
CREATE INDEX idx_subcategoria_proteina ON subcategoria_proteina(proteina_id);

-- ==================== VISTAS PARA REPORTES ====================

CREATE VIEW vista_inventario_carniceria AS
SELECT 
    pv.sku,
    pb.nombre_base as producto,
    prot.nombre as proteina,
    c.nombre as corte,
    sc.nombre as subcategoria,
    pr.nombre as presentacion,
    proc.nombre as procesamiento,
    oh.nombre as tipo_hueso,
    op.nombre as tipo_piel,
    pv.lean_pct,
    pv.unidad_medida
FROM producto_variacion pv
JOIN producto_base pb ON pv.producto_base_id = pb.id
JOIN proteina prot ON pb.proteina_id = prot.id
LEFT JOIN corte c ON pb.corte_id = c.id
JOIN subcategoria_proteina sc ON pb.subcategoria_id = sc.id
JOIN presentacion pr ON pv.presentacion_id = pr.id
LEFT JOIN procesamiento proc ON pv.procesamiento_id = proc.id
LEFT JOIN opcion_hueso oh ON pv.hueso_id = oh.id
LEFT JOIN opcion_piel op ON pv.piel_id = op.id;

COMMENT ON TABLE proteina IS 'Tipos de proteína para carnicería (RES, CERDO, POLLO, etc.)';
COMMENT ON TABLE producto_variacion IS 'SKUs específicos con todas las variaciones de producto';