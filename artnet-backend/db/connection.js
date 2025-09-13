const mysql = require("mysql2/promise");
require("dotenv").config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "jhanpoolybrandon911",
  database: process.env.DB_NAME || "mi_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+00:00",
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a MySQL establecida correctamente");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error.message);
    process.exit(1);
  }
};

// Probar conexión al inicializar
testConnection();

module.exports = pool;
