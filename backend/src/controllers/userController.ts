import { createUser, getUserByEmail, editUser, deleteUser, getUserById } from "../models/userModel.js";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Email, name, and password are required.' });
        }

        const exist = await getUserByEmail(email);
        if (exist) return res.status(409).json({ error: 'Email is already in use.' });

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await createUser({ email, name, passwordHash });
        return res.status(201).json({ message: 'Account created.', user: { ...user, password, passwordHash: undefined } });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Password incorrect.' });

        res.status(200).json({ message: 'Logged in.', user: { ...user, password, passwordHash: undefined } });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export const editAccount = async (req: Request, res: Response) => {
    try {
        const { id, email, name, password } = req.body;
        if (!id) {
            return res.status(500).json({ error: 'Private account ID not received.' });
        }

        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'Account not found.' });

        const newEmail = email ?? user.email;
        const newName = name ?? user.name;
        const newPasswordHash = password ? await bcrypt.hash(password, 12) : user.passwordHash;

        const editedUser = await editUser({ id: user.id, email: newEmail, name: newName, passwordHash: newPasswordHash });
        return res.status(200).json({ message: 'Account edited successfully.', user: { ...editedUser, password: password ?? null, passwordHash: undefined } });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await getUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'Account not found.' });

        const passValid = await bcrypt.compare(password, user.passwordHash);
        if (!passValid) return res.status(401).json({ error: 'Password incorrect.' });

        await deleteUser(email);
        res.status(200).json({ message: 'Account deleted.' });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}
