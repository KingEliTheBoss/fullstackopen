import express from "express";
const app = express();
app.use(express.json());

import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
    if (!req.query.height || !req.query.weight) {
        res.send({
            error: "malformatted parameters"
        });
    }
    const bmi: string = calculateBmi(Number(req.query.height), Number(req.query.weight));
    res.send({
        weight: req.query.weight,
        height: req.query.height,
        bmi: bmi
    });
});

app.post("/exercises", (req, res) => {
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) {
        res.status(400).send({ error: "Missing parameters" });
        return;
    }

    if (isNaN(Number(target))) {
        res.status(400).send({ error: "Malformatted parameters" });
        return;
    }

    const dE = daily_exercises as number[];

    dE.forEach(dayHours => {
        if (isNaN(dayHours)) {
            res.status(400).send({ error: "Malformatted parameters!" });
            return;
        }
    })

    const result = calculateExercises(daily_exercises, target);
    res.send(result);
    return;
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});