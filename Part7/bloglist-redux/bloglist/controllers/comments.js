const commentsRouter = require("express").Router();
const Comment = require("../models/comment");
const middleware = require("../utils/middleware");

commentsRouter.get("/:id/comments", async (request, response) => {
    const comments = await Comment.find({}).populate("blog", { id: 1 });
    response.json(comments);
});

commentsRouter.post("/:id/comments", middleware.blogExtractor, async (request, response, next) => {
    const body = request.body;
    const blog = request.blog;

    const comment = new Comment({
        content: body.content,
        blog: blog
    });

    const savedComment = await comment.save();
    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save();

    response.status(201).json(savedComment);
});

module.exports = commentsRouter;