const Publication = require("../models/Publication.js");
const { validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary.js");
const Comment = require("../models/Comment");

const PublicationController = {
  // Crear nueva publicación con validación
  create: async (req, res) => {
    // Verificamos errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, image, userId } = req.body;

      let imageUrl = null;

      if (req.file) {
        // Convertir buffer a base64 para Cloudinary
        const imageBase64 = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;

        // Subir a Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
          folder: "artnet_publications", // opcional, para organizar en Cloudinary
        });

        imageUrl = uploadResponse.secure_url;
      }
      const nuevaPublicacion = await Publication.create({
        title,
        description,
        image: imageUrl,
        userId: parseInt(userId),
      });

      res.status(201).json(nuevaPublicacion);
    } catch (error) {
      console.error("Error al crear publicación:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  findAll: async (req, res) => {
    try {
      const publicaciones = await Publication.findAll();
      res.status(200).json(publicaciones);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener publicaciones" });
    }
  },

  findById: async (req, res) => {
    try {
      const { id } = req.params;
      const publicacion = await Publication.findById(id);
      const comments = await Comment.showAll(id);
      if (!publicacion) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }

      res.status(200).json({
        publicacion,
        comentarios: comments,
      });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Publication.deleteById(id);

      if (!resultado) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }

      res.status(200).json({ message: resultado });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

module.exports = PublicationController;
