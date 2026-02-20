import db from "../config/db.js";

// Create User
export const createUser = async (name, email) => {
  const [result] = await db.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
  );
  return result;
};

// Get All Users
export const getAllUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM users");
  return rows;
};

// Get User By ID
export const getUserById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export default { createUser, getAllUsers, getUserById };
