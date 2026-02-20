import db from "../config/db.js";

let _createdCol = null;
const getCreatedColumn = async () => {
  if (_createdCol) return _createdCol;

  const schema = process.env.DB_NAME;
  const candidates = ["created_at", "createdAt", "created", "createdon"];

  const placeholders = candidates.map(() => "?").join(",");
  const query = `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME IN (${placeholders})`;
  const params = [schema, ...candidates];

  try {
    const [rows] = await db.execute(query, params);
    if (rows.length) {
      _createdCol = rows[0].COLUMN_NAME;
    } else {
      _createdCol = null;
    }
  } catch (err) {
    _createdCol = null;
  }

  return _createdCol;
};

export const insertUser = async (userData) => {
  const { name, email, createdAt } = userData;
  const createdCol = await getCreatedColumn();

  if (createdCol) {
    const sql = `INSERT INTO users (name, email, ${createdCol}) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [name, email, createdAt]);

    return {
      id: result.insertId,
      name,
      email,
      createdAt,
    };
  }

  // If no created column, insert without it
  const [result] = await db.execute(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
  );

  return {
    id: result.insertId,
    name,
    email,
  };
};

// Fetch All Users (with optional search)
export const fetchUsers = async (search = "") => {
  const createdCol = await getCreatedColumn();
  let selectCreated = createdCol
    ? `${createdCol} AS created_at`
    : "NULL AS created_at";

  let query = `SELECT id, name, email, ${selectCreated} FROM users`;
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
  const createdCol = await getCreatedColumn();
  const selectCreated = createdCol
    ? `${createdCol} AS created_at`
    : "NULL AS created_at";

  const sql = `SELECT id, name, email, ${selectCreated} FROM users WHERE id = ?`;
  const [rows] = await db.execute(sql, [id]);

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
  const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  insertUser,
  fetchUsers,
  fetchUserById,
  removeUser,
};
