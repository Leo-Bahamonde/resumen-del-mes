import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Obtener todas las transacciones
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT id, fecha, descripcion, monto, tipo, created_at
        FROM transacciones
        ORDER BY fecha DESC, created_at DESC
      `;
      
      return res.status(200).json({
        success: true,
        data: rows
      });
    }

    // POST - Crear nueva transacción
    if (req.method === 'POST') {
      const { fecha, descripcion, monto, tipo } = req.body;

      // Validaciones
      if (!descripcion || !monto || !tipo) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: descripcion, monto, tipo'
        });
      }

      if (!['ingreso', 'egreso'].includes(tipo)) {
        return res.status(400).json({
          success: false,
          error: 'El tipo debe ser "ingreso" o "egreso"'
        });
      }

      if (isNaN(monto) || monto <= 0) {
        return res.status(400).json({
          success: false,
          error: 'El monto debe ser un número positivo'
        });
      }

      // Insertar transacción
      const { rows } = await sql`
        INSERT INTO transacciones (fecha, descripcion, monto, tipo)
        VALUES (
          ${fecha || new Date().toISOString().split('T')[0]},
          ${descripcion.trim()},
          ${parseFloat(monto)},
          ${tipo}
        )
        RETURNING id, fecha, descripcion, monto, tipo, created_at
      `;

      return res.status(201).json({
        success: true,
        data: rows[0]
      });
    }

    // DELETE - Eliminar transacción
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere el ID de la transacción'
        });
      }

      const { rowCount } = await sql`
        DELETE FROM transacciones
        WHERE id = ${parseInt(id)}
      `;

      if (rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Transacción no encontrada'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Transacción eliminada correctamente'
      });
    }

    // Método no permitido
    return res.status(405).json({
      success: false,
      error: `Método ${req.method} no permitido`
    });

  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
