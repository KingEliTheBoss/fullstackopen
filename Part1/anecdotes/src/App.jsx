import { useState } from 'react'

const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
]

let votes = Array(anecdotes.length).fill(0)

const App = () => {
    const [selected, setSelected] = useState(0)
    const [currentVote, setCurrentVote] = useState(0)

    const changeAnecdote = () => {
        let updatedSelected = selected
        if (selected >= anecdotes.length - 1) {
            updatedSelected = 0
        } else {
            updatedSelected++
        }

        setSelected(updatedSelected)
        setCurrentVote(votes[updatedSelected])
    }

    const addVote = () => {
        votes[selected] += 1
        setCurrentVote(votes[selected])
    }

    const indexOfMax = (arr) => {
        if (arr.length === 0) {
            return -1
        }

        let max = arr[0]
        let maxIndex = 0

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i]
            }
        }
        return maxIndex
    }

    return (
        <div>
            <h1>Anecdote of the day</h1>
            <p>{anecdotes[selected]}</p>
            <p>has {currentVote} votes</p>
            <button onClick={addVote}>vote</button>
            <button onClick={changeAnecdote}>another anecdote</button>
            <h1>Anecdote with most votes</h1>
            <p>{anecdotes[indexOfMax(votes)]}</p>
        </div>
    )
}

export default App