import db from "../config/db.js";

// Insert User
export const insertUser = async (userData) => {
  const { name, email, createdAt } = userData;

  const [result] = await db.execute(
    "INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)",
    [name, email, createdAt]
  );

  return {
    id: result.insertId,
    name,
    email,
    createdAt,
  };
};

// Fetch All Users (with optional search)
export const fetchUsers = async (search = "") => {
  let query = "SELECT id, name, email, created_at FROM users";
  let values = [];

  if (search) {
    query += " WHERE name LIKE ? OR email LIKE ?";
    values.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await db.execute(query, values);

  return rows.map((user) => ({
    id: user.id,
    fullName: user.name,
    emailAddress: user.email,
    registeredOn: user.created_at,
  }));
};

// Fetch Single User
export const fetchUserById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [id]
  );

  if (!rows.length) return null;

  const user = rows[0];

  return {
    id: user.id,
    fullName: user.name,
    emailAddress: user.email,
    registeredOn: user.created_at,
  };
};

// Delete User
export const removeUser = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM users WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
};

export default {
  insertUser,
  fetchUsers,
  fetchUserById,
  removeUser,
};
