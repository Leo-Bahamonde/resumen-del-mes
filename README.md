# Resumen del Mes - Control de Finanzas

Aplicación web para control mensual de finanzas personales con backend en Vercel y base de datos PostgreSQL.

## 🚀 Características

- ✅ Registro de ingresos y egresos
- ✅ Cálculo automático de totales y diezmo (10%)
- ✅ Persistencia en base de datos PostgreSQL
- ✅ Backend serverless en Vercel
- ✅ Interfaz moderna y responsive
- ✅ Ordenamiento por fecha

## 📋 Requisitos

- Node.js 18+ (para desarrollo local)
- Cuenta en Vercel (para deployment)
- Git (para control de versiones)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd pagina-resumen-del-mes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Vercel Postgres

#### Opción A: Desarrollo Local

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Iniciar sesión en Vercel:
```bash
vercel login
```

3. Vincular el proyecto:
```bash
vercel link
```

4. Crear base de datos Postgres desde el dashboard de Vercel:
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Click en "Storage" → "Create Database"
   - Selecciona "Postgres"
   - Sigue las instrucciones

5. Descargar variables de entorno:
```bash
vercel env pull .env.local
```

6. Ejecutar el schema SQL:
   - Ve al dashboard de Vercel → Storage → tu base de datos
   - Click en "Query" o "Data"
   - Copia y ejecuta el contenido de `sql/schema.sql`

#### Opción B: Solo Producción

1. Haz push del código a GitHub
2. Importa el proyecto en Vercel
3. Agrega Vercel Postgres desde el dashboard
4. Ejecuta el schema SQL desde la consola de Postgres en Vercel

## 🏃 Desarrollo Local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Deployment

### Automático (Recomendado)

1. Conecta tu repositorio Git con Vercel
2. Cada push a `main` desplegará automáticamente

### Manual

```bash
npm run deploy
```

## 📁 Estructura del Proyecto

```
.
├── api/
│   └── transacciones.js    # API serverless para CRUD de transacciones
├── sql/
│   └── schema.sql          # Schema de base de datos PostgreSQL
├── index.html              # Página principal
├── scripts.js              # Lógica del frontend
├── style.css               # Estilos
├── vercel.json             # Configuración de Vercel
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

## 🔌 API Endpoints

### GET `/api/transacciones`
Obtiene todas las transacciones.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fecha": "2025-12-20",
      "descripcion": "Sueldo",
      "monto": 150000,
      "tipo": "ingreso",
      "created_at": "2025-12-20T10:00:00Z"
    }
  ]
}
```

### POST `/api/transacciones`
Crea una nueva transacción.

**Body:**
```json
{
  "fecha": "2025-12-20",
  "descripcion": "Alquiler",
  "monto": 50000,
  "tipo": "egreso"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "fecha": "2025-12-20",
    "descripcion": "Alquiler",
    "monto": 50000,
    "tipo": "egreso",
    "created_at": "2025-12-20T10:05:00Z"
  }
}
```

### DELETE `/api/transacciones?id={id}`
Elimina una transacción por ID.

**Respuesta:**
```json
{
  "success": true,
  "message": "Transacción eliminada correctamente"
}
```

## 🗄️ Schema de Base de Datos

```sql
CREATE TABLE transacciones (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion VARCHAR(255) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js (Serverless Functions)
- **Base de Datos:** PostgreSQL (Vercel Postgres)
- **Hosting:** Vercel
- **ORM:** @vercel/postgres

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

1. Verifica que las variables de entorno estén configuradas:
```bash
vercel env pull .env.local
```

2. Asegúrate de que la base de datos esté creada en Vercel

### Error: "Table 'transacciones' does not exist"

Ejecuta el schema SQL desde el dashboard de Vercel:
1. Ve a Storage → tu base de datos
2. Click en "Query"
3. Ejecuta el contenido de `sql/schema.sql`

### La aplicación no carga datos

1. Abre la consola del navegador (F12)
2. Revisa los errores en la pestaña "Console"
3. Verifica que los endpoints API respondan correctamente

## 📝 Licencia

ISC

## 👤 Autor

Leo Bahamonde
