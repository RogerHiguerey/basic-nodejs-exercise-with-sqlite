import { getDb } from '../config/database.js';

export class User {
  static async getAll() {
    const db = await getDb();
    return db.all("SELECT * FROM users");
  }

  static async create(user) {
    const db = await getDb();
    const result = await db.run("INSERT INTO users (name, email) VALUES (?, ?)", [user.name, user.email]);
    return result.lastID;
  }

  static async getById(id) {
    const db = await getDb();
    return db.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  static async update(id, user) {
    const db = await getDb();
    await db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [user.name, user.email, id]);
  }

  static async delete(id) {
    const db = await getDb();
    await db.run("DELETE FROM users WHERE id = ?", [id]);
  }
}