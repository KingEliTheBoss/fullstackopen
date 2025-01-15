require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const Person = require("./models/person");

morgan.token("body", (request) => JSON.stringify(request.body));

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));



let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "Eli Sal",
        "number": "123"
    }
];

app.get("/api/info", async (request, response) => {
    const now = new Date();

    let count = await Person.countDocuments({});

    response.send(`<div>
    <p>Phonebook has info for ${count} people</p>
    <p>${now}</p>
    </div>`);
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

const generateId = () => {
    const newId = Math.floor(Math.random() * 1000000);
    return newId;
};

const postMorgan = morgan(":method :url :status :res[content-length] - :response-time ms :body");

app.post("/api/persons", postMorgan, (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({
            error: "name or number missing"
        });
    }

    const person = new Person({
        name: name,
        phoneNumber: number
    });

    person.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        phoneNumber: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

//THIS IS MIDDLEWARE
//Returns if route doesn't exist, should be used at end of code
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

//THIS IS MIDDLEWARE
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).send({ error: error.message });
    }

    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});