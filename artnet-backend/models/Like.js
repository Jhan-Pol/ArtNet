const db = require("../db/connection");
class Like {
  constructor(likesData) {
    (this.id = likesData.id),
      (this.user_id = likesData.user_id),
      (this.publication_id = likesData.publication_id),
      (this.createdAt = likesData.created_at);
  }
  static async create(likesData) {
    const { user_id, publication_id } = likesData;

    const query = `
      INSERT INTO likes (user_id, publication_id, created_at) 
      VALUES (?, ?, NOW())
    `;
    try {
      const [result] = await db.execute(query, [user_id, publication_id]);

      return {
        id: result.insertId,
        user_id,
        publication_id,
        created_at: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  static async delete(likesData) {
    try {
      const { user_id, publication_id } = likesData;
      const query = `
        DELETE FROM likes 
        WHERE user_id = ? AND publication_id = ?
      `;
      const [result] = await db.execute(query, [user_id, publication_id]);
      if (result.affectedRows === 0) {
        console.log("No se encontró el like para eliminar");
        return null;
      }
      return {
        user_id,
        publication_id,
        message: "Like eliminado correctamente",
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserLikes(userId) {
    try {
      const query = `
        SELECT publication_id 
        FROM likes 
        WHERE user_id = ?
      `;
      const [rows] = await db.execute(query, [userId]);

      if (rows.length === 0) {
        console.log("No hay likes para este usuario");
        return [];
      }

      return rows.map((row) => row.publication_id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Like;
