const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Validaciones para registro
const signupValidation = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    ),

  body("email")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
    ),
];

// Validaciones para login
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

// Rutas públicas
router.post("/signup", signupValidation, AuthController.signup);
router.post("/login", loginValidation, AuthController.login);

// Rutas protegidas (requieren autenticación)
router.get("/profile", authenticateToken, AuthController.getProfile);

// Ruta para verificar si el token es válido
router.get("/verify-token", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token válido",
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
