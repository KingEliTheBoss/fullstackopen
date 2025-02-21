const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
    {
        title: "Workout",
        author: "Eli Sal",
        url: "https://www.google.com/",
        likes: 20
    },
    {
        title: "Job application",
        author: "Jordan CS",
        url: "https://www.youtube.com/",
        likes: 64
    }
];

const nonExistingId = async () => {
    const blog = new Blog({ title: "toe jam", author: "Karanium", url: "wow", likes: 69 });
    await blog.save();
    await blog.deleteOne();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
};

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
};