import { Request, Response } from "express";
import db from "../services/prisma" // Import the Prisma client

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    const { username, email } = req.body;

    try {
        // Check if the user already exists based on the email
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // User already exists, return the existing user
            res.status(200).json({ message: "User already exists", user: existingUser });
        } else {
            // Create a new user if one doesn't exist
            const newUser = await db.user.create({
                data: { username, email },
            });
            res.status(201).json({ message: "User created successfully", user: newUser });
        }
    } catch (error) {
        res.status(500).json({ message: "Error handling user data", error });
    }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await db.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const updatedUser = await db.user.update({
            where: { id: parseInt(id) },
            data: { username, email },
        });
        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
