const Like = require("../models/Like");
const { validationResult } = require("express-validator");
class LikeController {
  static async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }
    try {
      const { user_id, publication_id } = req.body;
      const newLike = await Like.create({
        user_id: parseInt(user_id),
        publication_id: parseInt(publication_id),
      });
      res.status(201).json(newLike);
    } catch (error) {
      throw error;
    }
  }

  static async delete(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }
    try {
      const { user_id, publication_id } = req.body;
      const deletedLike = await Like.delete({
        user_id: parseInt(user_id),
        publication_id: parseInt(publication_id),
      });
      if (!deletedLike) {
        return res.status(404).json({
          success: false,
          message: "Like no encontrado o ya eliminado",
        });
      }
      res.status(200).json(deletedLike);
    } catch (error) {
      throw error;
    }
  }

  static async getUserLikes(req, res) {
    const { user_id } = req.params;
    try {
      const likes = await Like.getUserLikes(parseInt(user_id));
      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los likes del usuario",
        error: error.message,
      });
    }
  }
}

module.exports = LikeController;
