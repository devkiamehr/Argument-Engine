import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { register, login, logout, editAccount, deleteAccount } from '../controllers/userController.js';

export const ru = express.Router();

ru.post("/register", register);
ru.post("/login", login);
ru.post("/logout", requireAuth, logout);
ru.put("/", requireAuth, editAccount);
ru.delete("/", requireAuth, deleteAccount);
