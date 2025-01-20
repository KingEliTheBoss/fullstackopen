const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });
    response.json(users);
});

usersRouter.post("/", async (request, response) => {
    const body = request.body;

    const saltRounds = 10;
    let passwordHash;
    if (body.password) {
        passwordHash = await bcrypt.hash(body.password, saltRounds);
    }


    const user = new User({
        username: body.username,
        password: passwordHash,
        name: body.name
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

module.exports = usersRouter;