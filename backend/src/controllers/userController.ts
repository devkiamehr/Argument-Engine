import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, editUser, deleteUser, getUserById } from "../models/userModel.js";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTS = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
}

const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const signAndSend = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('token', token, { ...COOKIE_OPTS, maxAge: MAX_AGE });
}

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
        signAndSend(res, user.id);
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

        signAndSend(res, user.id);
        return res.status(200).json({ message: 'Logged in.', user: { ...user, password, passwordHash: undefined } });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export const logout = (_req: Request, res: Response) => {
    res.clearCookie('token', COOKIE_OPTS);
    return res.status(200).json({ message: 'Logged out.' });
}

export const me = async (req: Request, res: Response) => {
    try {
        const id = req.userId!;
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'Account not found.' });

        return res.status(200).json({ user: { ...user, passwordHash: undefined } });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}

export const editAccount = async (req: Request, res: Response) => {
    try {
        const id = req.userId!;
        const { email, name, password } = req.body;

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
        const id = req.userId!;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required to delete account.' });
        }

        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'Account not found.' });

        const passValid = await bcrypt.compare(password, user.passwordHash);
        if (!passValid) return res.status(401).json({ error: 'Password is incorrect.' });

        res.clearCookie('token', COOKIE_OPTS);
        await deleteUser(id);
        res.status(200).json({ message: 'Account deleted.' });
    } catch {
        res.status(500).json({ error: 'Internal server error.' });
    }
}
