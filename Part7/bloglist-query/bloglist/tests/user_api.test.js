const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const bcrypt = require("bcrypt");
const User = require("../models/user");

describe("THE TESTS", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("root", 10);
        const user = new User({ username: "root", password: passwordHash });

        await user.save();
    });

    describe("POST TESTS", () => {
        test("creation succeeds with a fresh username", async () => {
            const usersAtStart = await helper.usersInDb();

            const newUser = {
                username: "KingEliTheBoss",
                password: "qwert789",
                name: "Eli Sal"
            };

            await api
                .post("/api/users")
                .send(newUser)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const usersAtEnd = await helper.usersInDb();
            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

            const usernames = usersAtEnd.map(u => u.username);
            assert(usernames.includes(newUser.username));
        });

        test("creation fails with proper statuscode and message if username already exists", async () => {
            const usersAtStart = await helper.usersInDb();

            const newUser = {
                username: "root",
                password: "salainen",
                name: "Superuser",
            };

            const result = await api
                .post("/api/users")
                .send(newUser)
                .expect(400)
                .expect("Content-Type", /application\/json/);

            const usersAtEnd = await helper.usersInDb();
            assert(result.body.error.includes("expected `username` to be unique"));

            assert.strictEqual(usersAtEnd.length, usersAtStart.length);
        });

        test("user without username or password is not added", async () => {
            const usersAtStart = await helper.usersInDb();

            const newUserNeither = {
                name: "OnlyName"
            };
            const newUserNoPassword = {
                username: "WithUsername",
                name: "WithName"
            }
            const newUserNoUsername = {
                password: "withPass123",
                name: "WithName"
            }

            await api
                .post("/api/users")
                .send(newUserNeither)
                .expect(400);

            const usersAtEndFirst = await helper.usersInDb();
            assert.strictEqual(usersAtEndFirst.length, usersAtStart.length);

            await api
                .post("/api/users")
                .send(newUserNoPassword)
                .expect(400);

            const usersAtEndSecond = await helper.usersInDb();
            assert.strictEqual(usersAtEndSecond.length, usersAtStart.length);

            await api
                .post("/api/users")
                .send(newUserNoUsername)
                .expect(400);

            const usersAtEndThird = await helper.usersInDb();
            assert.strictEqual(usersAtEndThird.length, usersAtStart.length);
        });
    });
});

after(async () => {
    await mongoose.connection.close();
});