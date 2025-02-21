import { createSlice, current } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
    name: "blogs",
    initialState: null,
    reducers: {
        setBlogs(state, action) {
            return action.payload.sort((a, b) => b.likes - a.likes);
        },
        appendBlogs(state, action) {
            state.push(action.payload);
        },
        likeBlog(state, action) {
            const id = action.payload.id;
            const likedBlog = action.payload;
            return state.map(blog => blog.id !== id ? blog : likedBlog).sort((a, b) => b.likes - a.likes);
        },
        removeBlog(state, action){
            const id = action.payload;
            return state.filter(blog=>blog.id !== id).sort((a, b) => b.likes - a.likes);
        }
    }
});

export const { appendBlogs, setBlogs, likeBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const createBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content);
        dispatch(appendBlogs(newBlog));
    };
};

export const updateBlog = (content, id) => {
    return async dispatch => {
        const likedBlog = await blogService.edit(content, id);
        dispatch(likeBlog(likedBlog));
    }
};

export const deleteBlog = (id)=>{
    return async dispatch =>{
        await blogService.remove(id);
        dispatch(removeBlog(id));
    }
};

export default blogSlice.reducer;