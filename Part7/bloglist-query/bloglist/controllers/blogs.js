const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 }).populate("comments", { content: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response, next) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response, next) => {
  const user = request.user;
  if (!user) {
    return response.status(404).json({ error: "user does not exist" });
  }

  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response.status(404).json({ error: "blog does not exist" });
  }

  if (blogToDelete.user.toString() === user.id.toString()) {
    await blogToDelete.deleteOne();
    return response.status(204).end();
  } else {
    return response.status(401).json({ error: "this user cannot delete this blog" });
  }
});

blogsRouter.put("/:id", middleware.userExtractor, async (request, response, next) => {
  const body = request.body;
  const user = request.user;
  if (!user) {
    return response.status(404).json({ error: "user does not exist" });
  }

  const blogToUpdate = await Blog.findById(request.params.id);
  if (!blogToUpdate) {
    return response.status(404).json({ error: "blog does not exist" });
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id.toString()
  };

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).end();
  } else if (blogToUpdate.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "this user cannot update this blog" });
  } else {
    //const updatedBlog = await blogToUpdate.updateOne(blog, { new: true }); //new: true doesn't retrieve new blog with updateOne method
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .populate("user", { username: 1, name: 1 });
    response.json(updatedBlog);
  }
});

module.exports = blogsRouter;