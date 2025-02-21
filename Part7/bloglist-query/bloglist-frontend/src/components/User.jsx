import { useUsersValue, useUsersDispatch } from "../contexts/UsersContext";
import { useMatch } from "react-router-dom";
import { CommentsDiv } from "../assets/Components.styled";

const User = ({ blogs }) => {
    const users = useUsersValue();
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