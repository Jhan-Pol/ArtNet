require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cloudinary = require("./config/cloudinary");
// Importar rutas
const authRoutes = require("./routes/auth");
const publicationRoutes = require("./routes/publicationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const app = express();

// Middlewares de seguridad
app.use(helmet());

// Configuración de CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message:
      "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
  },
});
app.use(limiter);

// Parsear JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error("Error global:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

console.log("Cloudinary config:", cloudinary.config());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
