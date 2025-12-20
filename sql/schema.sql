-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion VARCHAR(255) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX IF NOT EXISTS idx_transacciones_created_at ON transacciones(created_at DESC);

-- Datos de ejemplo (opcional - puedes eliminar esto después)
INSERT INTO transacciones (fecha, descripcion, monto, tipo) VALUES
  (CURRENT_DATE, 'Sueldo', 150000, 'ingreso'),
  (CURRENT_DATE, 'Alquiler', 50000, 'egreso'),
  (CURRENT_DATE, 'Supermercado', 25000, 'egreso');
