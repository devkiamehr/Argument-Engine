import 'dotenv/config';
import express from "express";
import cookieParser from 'cookie-parser';
import { requireAuth } from './middleware/requireAuth.js';
import { rs } from './routers/syllogismRouter.js';
import { ru } from './routers/userRouter.js';

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }

    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/user", ru);
app.use("/syllogism", requireAuth, rs);

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    });
}

export default app;
