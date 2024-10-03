import { Router } from "express";
import { createUser, getUser, updateUser, deleteUser } from "../controller/userController";

const router = Router();

// Route for creating a user
router.post("/create", createUser);

// Route for fetching a user by ID
router.get("/:id", getUser);

// Route for updating a user by ID
router.put("/:id", updateUser);

// Route for deleting a user by ID
router.delete("/:id", deleteUser);

export default router;
