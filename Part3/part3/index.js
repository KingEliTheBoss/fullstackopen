const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});


//require("dotenv").config();
//const express = require("express");
//const cors = require("cors");
//
//const app = express();
//const Note = require("./models/note");
//
//app.use(cors());
//
////THIS IS MIDDLEWARE
//app.use(express.json());
//app.use(express.static("dist"));
//
////THIS IS MIDDLEWARE
//const requestLogger = (request, response, next) => {
//    console.log("Method:", request.method);
//    console.log("Path:  ", request.path);
//    console.log("Body:  ", request.body);
//    console.log("---");
//    next();
//};
//app.use(requestLogger);
//
//
//
//
//
//
///*let notes = [
//    {
//        id: 1,
//        content: "HTML is easy"F,
//        important: true
//    },
//    {
//        id: 2,
//        content: "Browser can execute only JavaScript",
//        important: false
//    },
//    {
//        id: 3,
//        content: "GET and POST are the most important methods of HTTP protocol",
//        important: true
//    }
//];*/
//
//app.get("/", (request, response) => {
//    response.send("<h1>Hello World!</h1>");
//});
//
//app.get("/api/notes", (request, response) => {
//    //response.json(notes)
//
//    Note.find({}).then(notes => {
//        response.json(notes);
//    });
//});
//
//app.get("/api/notes/:id", (request, response, next) => {
//    Note.findById(request.params.id)
//        .then(note => {
//            if (note) {
//                response.json(note);
//            } else {
//                response.status(404).end();
//            }
//        })
//        .catch(error => next(error));
//});
//
///*const generateId = () => {
//    const maxId = notes.length > 0
//        ? Math.max(...notes.map(n => Number(n.id)))
//        : 0
//    return maxId + 1
//};*/
//
//app.post("/api/notes", (request, response, next) => {
//    const body = request.body;
//
//    if (body.content === undefined) {
//        return response.status(400).json({ error: "content missing" });
//    }
//
//    const note = new Note({
//        content: body.content,
//        important: Boolean(body.important) || false
//    });
//
//    note.save()
//        .then(savedNote => {
//            response.json(savedNote);
//        })
//        .catch(error => next(error));
//});
//
//app.put("/api/notes/:id", (request, response, next) => {
//    const { content, important } = request.body;
//
//    Note.findByIdAndUpdate(
//        request.params.id,
//        { content, important },
//        { new: true, runValidators: true, context: "query" }
//    )
//        .then(updatedNote => {
//            response.json(updatedNote);
//        })
//        .catch(error => next(error));
//});
//
//app.delete("/api/notes/:id", (request, response, next) => {
//    Note.findByIdAndDelete(request.params.id)
//        .then(() => {
//            response.status(204).end();
//        })
//        .catch(error => next(error));
//});
//
//
//
//
//
//
//
////THIS IS MIDDLEWARE
////Returns if route doesn't exist, should be used at end of code
//const unknownEndpoint = (request, response) => {
//    response.status(404).send({ error: "unknown endpoint" });
//};
//app.use(unknownEndpoint);
//
////THIS IS MIDDLEWARE
//const errorHandler = (error, request, response, next) => {
//    console.error(error.message);
//
//    if (error.name === "CastError") {
//        return response.status(400).send({ error: "malformatted id" });
//    } else if (error.name === "ValidationError") {
//        return response.status(400).json({ error: error.message });
//    }
//
//    next(error);
//};
//app.use(errorHandler);
//
//
//
//const PORT = process.env.PORT;
//app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
//});
//