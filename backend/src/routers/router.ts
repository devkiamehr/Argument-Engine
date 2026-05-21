import express from "express";
import { postSyllogism } from "../controllers/syllogismController.js";

const r = express.Router();


r.post("/syllogism", async (req, res) => {
    try {
        const conclusion = postSyllogism(req.body);

        res.status(200).send({
            conclusion: conclusion
        })
    } catch(error) {
        res.status(401).send({
            error: error
        })
    }
});
