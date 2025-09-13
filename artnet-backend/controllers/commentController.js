const Comment = require("../models/Comment");
const { validationResult } = require("express-validator");
class CommentController {
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
      const { content, userId, publicationId } = req.body;
      const newComment = await Comment.create({
        content,
        userId: parseInt(userId),
        publicationId: parseInt(publicationId),
      });

      res.status(201).json(newComment);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommentController;
