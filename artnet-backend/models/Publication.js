const db = require("../db/connection");

class Publication {
  constructor(publicationData) {
    this.id = publicationData.id;
    this.title = publicationData.title;
    this.description = publicationData.description_;
    this.image = publicationData.image_url;
    this.userId = publicationData.user_id;
    this.createdAt = publicationData.created_at;
  }

  static async create(publicationData) {
    const { title, description, image, userId } = publicationData;

    const query = `
      INSERT INTO publications (title, description_, image_url, user_id, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `;
    try {
      const [result] = await db.execute(query, [
        title,
        description,
        image,
        userId,
      ]);

      return {
        id: result.insertId,
        title,
        description_: description,
        image_url: image,
        user_id: userId,
        created_at: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
  SELECT 
    publications.id,
    publications.title,
    publications.description_ AS description,
    publications.image_url AS image,
    publications.created_at,
    users.username
  FROM publications 
  JOIN users ON publications.user_id = users.id
  WHERE publications.id = ?
`;

    try {
      const [result] = await db.execute(query, [id]);
      if (result.length === 0) return null;

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const query = "SELECT * FROM publications";
      const [rows] = await db.execute(query);

      if (rows.length === 0) {
        console.log("No hay publicaciones registradas");
        return `No existen publicaciones`;
      }

      return rows.map((row) => new Publication(row));
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(id) {
    try {
      const query = "DELETE FROM publications WHERE id = ?";
      const result = await db.execute(query, [id]);

      if (result[0].affectedRows === 0) {
        console.log("No se puede eliminar tal publicacion ya que no existe");
        return false;
      }

      return `Se ha borrado la publicacion`;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Publication;
