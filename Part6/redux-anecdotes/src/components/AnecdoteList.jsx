import { useSelector, useDispatch } from 'react-redux';
import { showNotification, removeNotification, setNotification } from "../reducers/notificationReducer";
import { updateAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        return anecdotes.filter(anec => anec.content.includes(filter));
    });
    const dispatch = useDispatch();

    const vote = (anecdote) => {
        dispatch(updateAnecdote(anecdote.id));
        dispatch(setNotification(anecdote.content, 5));
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default AnecdoteList;