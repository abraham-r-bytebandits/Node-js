import * as userModel from "../models/user.model.js";

// Create User
export const createUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await userModel.createUser(name, email);

    res.json({
      message: "User created successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};
