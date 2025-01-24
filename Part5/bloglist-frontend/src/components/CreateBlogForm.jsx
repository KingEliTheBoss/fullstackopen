import { useState } from "react";

const CreateBlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const addBlog = (event) => {
        event.preventDefault();
        createBlog({
            title: title,
            author: author,
            url: url
        });

        setTitle("");
        setAuthor("");
        setUrl("");
    };

    return (
        <div>
            <h2>create new</h2>
            <form id="formCreateBlog" onSubmit={addBlog}>
                <p>title: <input data-testid="titleInput" id="titleInput" type='text' value={title} onChange={event => setTitle(event.target.value)}></input></p>
                <p>author: <input data-testid="authorInput" id="authorInput" type='text' value={author} onChange={event => setAuthor(event.target.value)}></input></p>
                <p>url: <input data-testid="urlInput" id="urlInput" type='text' value={url} onChange={event => setUrl(event.target.value)}></input></p>
                <button id="submitButton" type='submit'>create</button>
            </form>
        </div>
    );
};

export default CreateBlogForm;