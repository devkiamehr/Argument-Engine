import { Request, Response } from 'express';
import { createSyllogism, findSyllogism, deleteSyllogism } from '../models/syllogismModel.js'
import { type lines } from "../types.js";
import { engine } from "../engine.js";

export const postSyllogism = async (req: Request, res: Response) => {
    try {
        const { lineOne, lineTwo } = req.body;
        const userId = req.userId!;

        if (!lineOne || !lineTwo) return res.status(400).json({ error: 'Two premises must be present.' })

        const lines: lines = { lineOne: lineOne, lineTwo: lineTwo }
        const conclusion = engine(lines);

        const syllogism = await createSyllogism({ lineOne: lineOne, lineTwo: lineTwo, conclusion: conclusion, userId: userId })
        if (!syllogism) return res.status(500).json({ error: 'Internal server error.' });

        return res.status(201).json({ syllogism })
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unexpected analysis failure.";
        return res.status(500).json({ error: message });
    }
}

export const getSyllogism = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const userId = req.userId!;

        if (!id) return res.status(400).json({ error: 'Syllogism ID is required.' });

        const syllogism = await findSyllogism(id, userId);
        if (!syllogism) return res.status(404).json({ error: 'Syllogism not found.' });

        return res.status(200).json({ syllogism });
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Internal server error.";
        return res.status(500).json({ error: message });
    }
}

export const delSyllogism = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const userId = req.userId!;

        if (!id) return res.status(400).json({ error: 'Syllogism ID is required.' });

        await deleteSyllogism(id, userId);

        return res.status(200).json({ message: 'Syllogism deleted.' });
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Internal server error.";
        return res.status(500).json({ error: message });
    }
}
