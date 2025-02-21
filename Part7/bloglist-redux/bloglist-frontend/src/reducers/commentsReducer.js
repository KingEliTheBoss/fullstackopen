import { createSlice, current } from "@reduxjs/toolkit";
import commentsService from "../services/comments";

const commentsSlice = createSlice({
    name: "comments",
    initialState: null,
    reducers: {
        setComments(state, action) {
            return action.payload;
        },
        appendComment(state, action) {
            state.push(action.payload);
        },
    }
});

export const { setComments, appendComment } = commentsSlice.actions;

export const initializeComments = (blogId) => {
    return async dispatch => {
        const comments = await commentsService.getAll(blogId);
        dispatch(setComments(comments));
    }
};

export const addComment = (newComment, blogId)=>{
    return async dispatch =>{
        const newComm = await commentsService.create(newComment, blogId);
        dispatch(appendComment(newComm));
    }
};

export default commentsSlice.reducer;