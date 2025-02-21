import { useRef } from "react";
import { Link } from "react-router-dom";
import Togglable from "./Togglable";
import CreateBlogForm from "./CreateBlogForm";
import { BlogsDiv } from "../assets/Components.styled";

const Blogs = ({ blogs }) => {
    const createBlogFormRef = useRef();

    return (
        <div>
            <Togglable buttonLabel="new blog" ref={createBlogFormRef}>
                <CreateBlogForm refOfTogglable={createBlogFormRef} />
            </Togglable>
            <br />
            {blogs.map((blog) => (
                <BlogsDiv key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></BlogsDiv>
            ))}
        </div>
    )
};

export default Blogs;