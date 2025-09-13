const db = require("../db/connection.js");

class Comment {
  constructor(dataComments) {
    this.id = dataComments.id;
    this.content = dataComments.content;
    this.userId = dataComments.user_id;
    this.publicationId = dataComments.publication_id;
    this.createdAt = dataComments.created_at;
  }

  static async create(dataComments) {
    const { content, userId, publicationId } = dataComments;
    const query = `INSERT INTO comments (content, user_id, publication_id, created_at) 
                   VALUES (?, ?, ?, NOW())`;

    try {
      const [result] = await db.execute(query, [
        content,
        userId,
        publicationId,
      ]);

      return {
        id: result.insertId,
        content,
        user_id: userId,
        publication_id: publicationId,
        created_at: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  static async delete(dataComments) {
    const { userId, publicationId } = dataComments;
    const query = `DELETE FROM comments WHERE user_id = ? AND publication_id = ?`;

    try {
      const [result] = await db.execute(query, [userId, publicationId]);

      if (result.affectedRows === 0) {
        return false;
      }

      return "Comentario eliminado correctamente";
    } catch (error) {
      throw error;
    }
  }

  static async showAll(id) {
    const query = `SELECT comments.id, comments.content, comments.created_at, users.username
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.publication_id = ?`;

    try {
      const [result] = await db.execute(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Comment;
