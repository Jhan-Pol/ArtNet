const multer = require("multer");

const storage = multer.memoryStorage(); // Guarda los archivos en memoria
const upload = multer({ storage });

module.exports = upload;
