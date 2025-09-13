const bcrypt = require("bcryptjs");
const db = require("../db/connection");

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.password = userData.password;
    this.email = userData.email;
    this.createdAt = userData.created_at;
  }

  static async create(userData) {
    try {
      const { username, email, password } = userData;

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (username, email, password, created_at) 
        VALUES (?, ?, ?, NOW())
      `;

      const [result] = await db.execute(query, [
        username,
        email,
        hashedPassword,
      ]);

      return {
        id: result.insertId,
        username,
        email,
        created_at: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await db.execute(query, [email]);

      if (rows.length === 0) {
        console.log("No hay usuarios registrados con ese email");
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await db.execute(query, [id]);

      if (rows.length === 0) {
        console.log("No existe tal usuario con ese id");
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const [rows] = await db.execute(query, [username]);

      if (rows.length === 0) {
        console.log("No existe usuario con este UserName");
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }
  // Verificar contraseña
  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Obtener datos del usuario sin la contraseña
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
