import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationDispatch } from "../contexts/NotificationContext";
import blogService from "../services/blogs";
import { GeneralButton, CreateBlogFormDiv } from "../assets/Components.styled";

const CreateBlogForm = ({ refOfTogglable }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const queryClient = useQueryClient();
    const notifDispatch = useNotificationDispatch();

    const newBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: (newBlog) => {
            const blogs = queryClient.getQueryData(["blogs"]);
            queryClient.setQueryData(["blogs"], blogs.concat(newBlog));

            refOfTogglable.current.toggleVisibility();

            notifDispatch({ type: "SET", payload: { type: "good", message: `a new blog ${newBlog.title} by ${newBlog.author} added` } });
        },
        onError: () => {
            notifDispatch({ type: "SET", payload: { type: "error", message: "Could not create blog" } });
        }
    });

    const addBlog = (event) => {
        event.preventDefault();
        newBlogMutation.mutate({
            title: title,
            author: author,
            url: url
        });

        setTitle("");
        setAuthor("");
        setUrl("");
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