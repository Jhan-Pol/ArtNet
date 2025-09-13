const express = require("express");
const { body } = require("express-validator");
const PublicationController = require("../controllers/publicationController");
const upload = require("../middleware/multer");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const publicationValidation = [
  body("title")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres"),

  body("description")
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),

  // body("image")
  //   .optional()
  //   .withMessage("La imagen debe ser una URL válida"),

  body("userId")
    .isInt()
    .withMessage("El ID de usuario debe ser un número entero")
    .toInt(),
];

// Rutas para publicaciones

router.post(
  "/create",
  authenticateToken,
  upload.single("image"),
  publicationValidation,
  PublicationController.create
);

router.get("/index", PublicationController.findAll);

router.get("/find/:id", PublicationController.findById);

router.delete("/delete/:id", PublicationController.deleteById);

module.exports = router;
