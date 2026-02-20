import * as userService from "../models/user.model.js";

// Standard API Response Helper
const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    timestamp: new Date().toISOString(),
    data,
  });
};

// Create User
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return sendResponse(res, 400, false, "Name and Email are required");
    }

    const newUser = await userService.insertUser({
      name,
      email,
      createdAt: new Date(),
    });

    return sendResponse(res, 201, true, "User created", newUser);
  } catch (error) {
    console.error("Create User Error:", error);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};

// Get All Users (With optional search)
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const users = await userService.fetchUsers(search);

    return sendResponse(res, 200, true, "Users fetched", users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return sendResponse(res, 500, false, "Failed to fetch users");
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return sendResponse(res, 400, false, "Invalid user ID");
    }

    const user = await userService.fetchUserById(userId);

    if (!user) {
      return sendResponse(res, 404, false, "User does not exist");
    }

    return sendResponse(res, 200, true, "User found", user);
  } catch (error) {
    console.error("Get User Error:", error);
    return sendResponse(res, 500, false, "Error retrieving user");
  }
};

// Delete User (NEW)
export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const deleted = await userService.removeUser(userId);

    if (!deleted) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User deleted successfully");
  } catch (error) {
    console.error("Delete Error:", error);
    return sendResponse(res, 500, false, "Deletion failed");
  }
};
