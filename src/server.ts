import express from "express";
import { engine } from "./engine.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.post("/api", (req, res) => {
    const { lineOne, lineTwo } = req.body;
    const data = { lineOne: lineOne, lineTwo: lineTwo };
    const result = engine(data);
    res.json({
        conclusion: result
    })
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
