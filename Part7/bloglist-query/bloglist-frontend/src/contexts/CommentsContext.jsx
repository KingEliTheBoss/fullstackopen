import { createContext, useReducer, useContext } from "react";

const commentsReducer = (state, action) => {
    switch (action.type) {
        case "SETCOMMENTS":
            return action.payload;
        case "APPENDCOMMENT":
            return state.concat(action.payload);
        default:
            return state;
    }
};

const CommentsContext = createContext();

export const useCommentsValue = () => {
    const commentsAndDispatch = useContext(CommentsContext);
    return commentsAndDispatch[0];
};
export const useCommentsDispatch = () => {
    const commentsAndDispatch = useContext(CommentsContext);
    return commentsAndDispatch[1];
};

export const CommentsContextProvider = (props) => {
    const [comments, commentsDispatch] = useReducer(commentsReducer, null);

    return (
        <CommentsContext.Provider value={[comments, commentsDispatch]}>
            {props.children}
        </CommentsContext.Provider>
    )
};