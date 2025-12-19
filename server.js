const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const connectionString = process.env.FINANZAS_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.STORAGE_URL;
const isProduction = !!connectionString;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// === CONFIGURACIÓN DE BASE DE DATOS ===
let db;
let dbType = isProduction ? 'pg' : 'sqlite';

console.log(`Iniciando en modo: ${isProduction ? 'PRODUCCIÓN (PostgreSQL)' : 'LOCAL (SQLite)'}`);

if (isProduction) {
    // --- POSTGRESQL (Heroku / Vercel) ---
    const { Pool } = require('pg');
    db = new Pool({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Requerido por algunos proveedores cloud
    });

    // Inicializar Tabla PG
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS transacciones (
            id SERIAL PRIMARY KEY,
            fecha DATE NOT NULL,
            descripcion VARCHAR(255) NOT NULL,
            monto DECIMAL(10, 2) NOT NULL,
            tipo VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.query(createTableQuery).catch(err => console.error('Error creando tabla PG:', err));

} else {
    // --- SQLITE (Local) ---
    const sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database('./finanzas.db', (err) => {
        if (err) console.error('Error abriendo SQLite:', err.message);
        else console.log('Conectado a SQLite.');
    });

    // Inicializar Tabla SQLite
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            monto REAL NOT NULL,
            tipo TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.run(createTableQuery, (err) => {
        if(err) console.error('Error creando tabla SQLite:', err);
    });
}

// === HELPER QUERY UNIFICADO ===
function query(sql, params) {
    return new Promise((resolve, reject) => {
        if (dbType === 'pg') {
            // Adaptar placeholders de ? a $1, $2...
            let paramIndex = 1;
            const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
            
            db.query(pgSql, params, (err, res) => {
                if (err) return reject(err);
                
                // Si es INSERT, normalizar retorno para que coincida con lo que esperamos
                if (res.command === 'INSERT' && res.rows.length > 0) {
                     return resolve({ ...res.rows[0], insertId: res.rows[0].id });
                }
                resolve(res.rows);
            });
        } else {
            // SQLite
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sql, params, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            } else {
                // INSERT, DELETE, UPDATE
                db.run(sql, params, function(err) {
                    if (err) return reject(err);
                    // this.lastID y this.changes disponibles aquí
                    resolve({ insertId: this.lastID, changes: this.changes });
                });
            }
        }
    });
}

// === RUTAS API ===

// Obtener todas
app.get('/api/transacciones', async (req, res) => {
    try {
        const results = await query('SELECT * FROM transacciones ORDER BY fecha DESC, id DESC');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// Crear
app.post('/api/transacciones', async (req, res) => {
    const { descripcion, monto, tipo } = req.body;
    let fecha;
    
    if (dbType === 'pg') {
         // Postgres prefiere YYYY-MM-DD
         fecha = new Date().toISOString().split('T')[0];
    } else {
         // SQLite texto
         fecha = new Date().toISOString().split('T')[0];
    }

    if (!descripcion || !monto || !tipo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Returning ID para Postgres
    const sql = dbType === 'pg' 
        ? 'INSERT INTO transacciones (fecha, descripcion, monto, tipo) VALUES (?, ?, ?, ?) RETURNING id'
        : 'INSERT INTO transacciones (fecha, descripcion, monto, tipo) VALUES (?, ?, ?, ?)';

    try {
        const result = await query(sql, [fecha, descripcion, monto, tipo]);
        res.status(201).json({ 
            id: result.insertId, 
            fecha, 
            descripcion, 
            monto, 
            tipo 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar transacción' });
    }
});

// Eliminar
app.delete('/api/transacciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM transacciones WHERE id = ?', [id]);
        // result.changes en sqlite, rowCount en pg (pero mi helper devuelve rows en pg)
        // Simplificación: Asumimos éxito si no hay error
        res.json({ message: 'Transacción eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar transacción' });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Exportar app para Vercel
module.exports = app;

// Solo escuchar si se ejecuta directamente (no en Vercel)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}
