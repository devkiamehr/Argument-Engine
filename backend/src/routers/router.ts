import express from "express";
import { postSyllogism } from "../controllers/syllogismController.js";

const r = express.Router();


r.post("/syllogism", postSyllogism);
