const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
    const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
    response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
    const note = await Note.findById(request.params.id);

    if (note) {
        response.status(200).json(note);
    } else {
        response.status(404).end();
    }

    // This got replaced by the code above, using async/await avoids callback hell, but
    // you need to use try/catch for possible errors, however, by installing express-async-errors
    // you don't need to use the try/catch at all, it goes to the middleware directly
    /*Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));*/
});

const getTokenFrom = request => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", "");
    }
    return null;
};

notesRouter.post("/", async (request, response, next) => {
    const body = request.body;

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const note = new Note({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        user: user.id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response, next) => {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

notesRouter.put("/:id", (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

module.exports = notesRouter;