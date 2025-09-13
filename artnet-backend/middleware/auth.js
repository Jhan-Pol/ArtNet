const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para verificar JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario aún existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token inválido - usuario no encontrado",
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    console.error("Error en authenticateToken:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

// Middleware opcional - permite rutas con o sin autenticación
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
        };
      }
    }

    next();
  } catch (error) {
    // En caso de error, simplemente continúa sin usuario autenticado
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
