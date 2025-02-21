import { useRef } from "react";
import { Link } from "react-router-dom";
import Togglable from "./Togglable";
import CreateBlogForm from "./CreateBlogForm";
import { BlogsDiv } from "../assets/Components.styled";

const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
};

const Blogs = ({ blogs, refOfTogglable }) => {
     const createBlogFormRef = useRef();

    return (
        <div>
            <Togglable buttonLabel="new blog" ref={createBlogFormRef}>
                <CreateBlogForm refOfTogglable={createBlogFormRef} />
            </Togglable>
            <br />
            {blogs.map((blog) => (
                <BlogsDiv key={blog.id} style={blogStyle}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></BlogsDiv>
            ))}
        </div>
    )
};

export default Blogs;