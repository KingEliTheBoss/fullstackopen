import express from "express";
const app = express();
app.use(express.json());

import { calculator, Operation } from "./calculator";

app.get("/ping", (_req, res) => {
    res.send("pong");
});

app.post("/calculate", (req, res) => {
    const { value1, value2, op } = req.body;

    if (!value1 || isNaN(Number(value1))) {
        res.status(400).send({ error: "..." });
        return;
    }

    const operation = op as Operation;

    const result = calculator(value1, value2, operation);
    res.send({ result });
    return;
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});