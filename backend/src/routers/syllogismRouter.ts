import express from "express";
import { delSyllogism, getSyllogism, listSyllogism, postSyllogism } from "../controllers/syllogismController.js";

export const rs = express.Router();

rs.post("/", postSyllogism);
rs.get("/", listSyllogism);
rs.get("/:id", getSyllogism);
rs.delete("/:id", delSyllogism);
