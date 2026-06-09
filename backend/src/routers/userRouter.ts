import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { register, login, logout, me, editAccount, deleteAccount } from '../controllers/userController.js';

export const ru = express.Router();

ru.post("/register", register);
ru.post("/login", login);
ru.post("/logout", requireAuth, logout);
ru.get("/me", requireAuth, me);
ru.put("/", requireAuth, editAccount);
ru.delete("/", requireAuth, deleteAccount);
