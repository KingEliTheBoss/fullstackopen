import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { GeneralButton, CreateBlogFormDiv } from "../assets/Components.styled";

const CreateBlogForm = ({ refOfTogglable }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const dispatch = useDispatch();

    const addBlog = (event) => {
        event.preventDefault();
        try {
            dispatch(createBlog({
                title: title,
                author: author,
                url: url
            }));

            refOfTogglable.current.toggleVisibility();

            dispatch(setNotification({
                notif: `a new blog ${title} by ${author} added`,
                type: "good",
            }, 5));

            setTitle("");
            setAuthor("");
            setUrl("");
        } catch (e) {
            dispatch(setNotification({
                notif: "Could not create blog",
                type: "error",
            }, 5));
        }
    };

    return (
        <CreateBlogFormDiv>
            <h2>create new</h2>
            <form id="formCreateBlog" onSubmit={addBlog}>
                <p>title: <input data-testid="titleInput" id="titleInput" type='text' value={title} onChange={event => setTitle(event.target.value)}></input></p>
                <p>author: <input data-testid="authorInput" id="authorInput" type='text' value={author} onChange={event => setAuthor(event.target.value)}></input></p>
                <p>url: <input data-testid="urlInput" id="urlInput" type='text' value={url} onChange={event => setUrl(event.target.value)}></input></p>
                <GeneralButton id="submitButton" type='submit'>create</GeneralButton>
            </form>
        </CreateBlogFormDiv>
    );
};

export default CreateBlogForm;