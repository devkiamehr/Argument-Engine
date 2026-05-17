import express from "express";
import { engine } from "./engine.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.post("/syllogism", (req, res) => {
    const { lineOne, lineTwo } = req.body;

    try {
        const data = { lineOne: lineOne, lineTwo: lineTwo };
        const result = engine(data);

        res.json({
            conclusion: result
        });
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unexpected analysis failure.";

        res.status(400).json({
            error: message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
});
