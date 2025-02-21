import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatch } from "react-router-dom";
import { initializeUsers } from "../reducers/usersReducer";
import { CommentsDiv } from "../assets/Components.styled";

const User = () => {
    const blogs = useSelector(({ blogs }) => blogs);
    const users = useSelector(({ users }) => users);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeUsers());
    }, []);

    const match = useMatch("/users/:id");

    if (!users) {
        return null;
    }
    
    const blogsByUserId = (id) =>
        blogs.filter(blog => blog.user.id === id);

    const user = users.find(user => user.id === match.params.id);

    const blogsByMatch = match
        ? blogsByUserId(match.params.id)
        : null;

    return (
        <CommentsDiv>
            <h1>{user.name}</h1>
            <h3>added blogs</h3>
            <ul>
                {blogsByMatch.map(blog => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </CommentsDiv>
    );
};

export default User;