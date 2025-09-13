const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");

class AuthController {
  // Registro de usuario
  static async signup(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: errors.array(),
        });
      }

      const { username, email, password } = req.body;

      // Verificar si el email ya existe
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          message: "El email ya está registrado",
        });
      }

      // Verificar si el username ya existe
      const existingUserByUsername = await User.findByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({
          success: false,
          message: "El nombre de usuario ya está en uso",
        });
      }

      // Crear el usuario
      const newUser = await User.create({ username, email, password });

      // Generar JWT
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            created_at: newUser.created_at,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Error en signup:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  // Inicio de sesión
  static async login(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Verificar contraseña
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Generar JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
          user: user.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  // Obtener perfil del usuario (requiere autenticación)
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
        },
      });
    } catch (error) {
      console.error("Error en getProfile:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}

module.exports = AuthController;
