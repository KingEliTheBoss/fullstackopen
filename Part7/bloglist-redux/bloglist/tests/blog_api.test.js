const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

describe("THE TESTS", () => {
    let authorize;

    beforeEach(async () => {
        await User.deleteMany({});
        const newUser = { username: "root", password: "root" };
        await api.post("/api/users").send(newUser);

        const loggedIn = await api.post("/api/login").send(newUser);

        authorize = {
            "Authorization": `Bearer ${loggedIn.body.token}`
        }

        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });

    describe("GET REQUEST TESTS", () => {
        test("blogs are returned as json", async (request) => {
            await api
                .get("/api/blogs")
                .set(authorize)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        test("all blogs are returned", async () => {
            const response = await api.get("/api/blogs").set(authorize);
            assert.strictEqual(response.body.length, helper.initialBlogs.length);
        });

        test("unique identifier is id", async () => {
            const response = await api.get("/api/blogs").set(authorize);
            assert.strictEqual(response.body.every(item => item.hasOwnProperty("id")), true);
        });
    });

    describe("POST REQUEST TESTS", () => {
        test("a valid blog can be added", async () => {
            const newBlog = {
                title: "A new blog appears before you",
                author: "Trainer Eli",
                url: "https://ptcgp-tracker.com/",
                likes: 105
            };

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

            assert.strictEqual(
                blogsAtEnd.some(blog =>
                    blog.title === newBlog.title &&
                    blog.author === newBlog.author &&
                    blog.url === newBlog.url &&
                    blog.likes === newBlog.likes
                ), true);
        });

        test("a blog without like property will default it to zero", async () => {
            const newBlog = {
                title: "A new blog appears before you",
                author: "Trainer Eli",
                url: "https://ptcgp-tracker.com/"
            };

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

            assert.strictEqual(
                blogsAtEnd.some(blog =>
                    blog.title === newBlog.title &&
                    blog.author === newBlog.author &&
                    blog.url === newBlog.url &&
                    blog.likes === 0
                ), true);
        });

        test("blog without title or url is not added", async () => {
            const newBlogNeither = {
                author: "Pete Za Hutt",
                likes: 30
            };
            const newBlogNoUrl = {
                title: "Is pretty",
                author: "Pete Za Hutt",
                likes: 30
            }
            const newBlogNoTitle = {
                author: "Pete Za Hutt",
                url: "https://twitch.com/",
                likes: 30
            }

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlogNeither)
                .expect(400);

            const blogsAtEndFirst = await helper.blogsInDb();
            assert.strictEqual(blogsAtEndFirst.length, helper.initialBlogs.length);

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlogNoUrl)
                .expect(400);

            const blogsAtEndSecond = await helper.blogsInDb();
            assert.strictEqual(blogsAtEndSecond.length, helper.initialBlogs.length);

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlogNoTitle)
                .expect(400);

            const blogsAtEndThird = await helper.blogsInDb();
            assert.strictEqual(blogsAtEndThird.length, helper.initialBlogs.length);
        });
    });

    describe("DELETE REQUEST TESTS", () => {
        test("succeeds with code 204 when valid id", async () => {
            const newBlog = {
                title: "A new blog appears before you",
                author: "Trainer Eli",
                url: "https://ptcgp-tracker.com/",
                likes: 105
            };

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlog);

            const blogsAtStart = await helper.blogsInDb();
            const blogToDelete = blogsAtStart.find(blog => blog.title === newBlog.title);

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set(authorize)
                .expect(204);

            const blogsAtEnd = await helper.blogsInDb();

            const contents = blogsAtEnd.map(r => r.title);
            assert(!contents.includes(blogToDelete.title));

            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
        });

        test("fails with code 204 when blog doesn't exist", async () => {
            const validNonExistingId = await helper.nonExistingId();

            await api
                .delete(`/api/blogs/${validNonExistingId}`)
                .set(authorize)
                .expect(404);
        });

        test("fails with code 400 when invalid id", async () => {
            const invalidId = "5a3d5da59070081a82a3445";

            await api
                .delete(`/api/blogs/${invalidId}`)
                .set(authorize)
                .expect(400);
        });
    });

    describe("PUT REQUEST TESTS", () => {
        test("succeeds with code 200 when valid", async () => {
            const newBlog = {
                title: "A new blog appears before you",
                author: "Trainer Eli",
                url: "https://ptcgp-tracker.com/",
                likes: 105
            };

            await api
                .post("/api/blogs")
                .set(authorize)
                .send(newBlog);

            const blogsAtStart = await helper.blogsInDb();
            const blogToUpdate = blogsAtStart.find(blog => blog.title === newBlog.title);
            blogToUpdate.likes = 33;

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set(authorize)
                .send(blogToUpdate)
                .expect(200);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

            assert.strictEqual(
                blogsAtEnd.some(blog =>
                    blog.title === blogToUpdate.title &&
                    blog.author === blogToUpdate.author &&
                    blog.url === blogToUpdate.url &&
                    blog.likes === blogToUpdate.likes
                ), true);
        });

        test("fails with code 400 | blog without title or url is not updated", async () => {
            const blogsAtStart = await helper.blogsInDb();
            const blogToUpdate = blogsAtStart[0];
            delete blogToUpdate.title;
            delete blogToUpdate.url;

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set(authorize)
                .send(blogToUpdate)
                .expect(400);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
        });

        test("fails with code 400 when invalid id", async ()=>{
            const invalidId = "5a3d5da59070081a82a3445";
            const blogsAtStart = await helper.blogsInDb();
            const blogToUpdate = blogsAtStart[0];
            blogToUpdate.id = invalidId;

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set(authorize)
                .send(blogToUpdate)
                .expect(400);
        });
    });
});

after(async () => {
    await mongoose.connection.close();
});