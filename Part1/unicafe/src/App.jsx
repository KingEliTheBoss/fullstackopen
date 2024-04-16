import { useState } from 'react'

let average = 0
let positive = 0

const StatisticLine = (props) => {
    return (
        <tr>
            <td>{props.text}</td>
            <td>{props.value}{props.acc}</td>
        </tr>
    )
}

const Stats = ({ statGood, statNeutral, statBad, statAll, statAverage, statPositive }) => {
    if (statGood === 0 && statNeutral === 0 && statBad === 0) {
        return <p>No feedback given</p>
    }
    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={statGood} />
                <StatisticLine text="neutral" value={statNeutral} />
                <StatisticLine text="bad" value={statBad} />
                <StatisticLine text="all" value={statAll} />
                <StatisticLine text="average" value={statAverage} />
                <StatisticLine text="positive" value={statPositive} acc=" %" />
            </tbody>
        </table>
    )
}

const Button = (props) => {
    return <button onClick={props.onClick}>{props.text}</button>
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [all, setAll] = useState(0)

    const handleGood = () => {
        const updatedGood = good + 1
        const updatedAll = updatedGood + neutral + bad
        setGood(updatedGood)
        setAll(updatedAll)
        average = (updatedGood - bad) / (updatedAll)
        positive = updatedGood / updatedAll * 100
    }
    const handleNeutral = () => {
        const updatedNeutral = neutral + 1
        const updatedAll = good + updatedNeutral + bad
        setNeutral(updatedNeutral)
        setAll(updatedAll)
        average = (good - bad) / (updatedAll)
        positive = good / updatedAll * 100
    }
    const handleBad = () => {
        const updatedBad = bad + 1
        const updatedAll = good + bad + updatedBad
        setBad(updatedBad)
        setAll(updatedAll)
        average = (good - updatedBad) / (updatedAll)
        positive = good / updatedAll * 100
    }

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGood} text="good" />
            <Button onClick={handleNeutral} text="neutral" />
            <Button onClick={handleBad} text="bad" />
            <h2>statistics</h2>
            <Stats statGood={good} statNeutral={neutral} statBad={bad} statAll={all} statAverage={average} statPositive={positive} />
        </div>
    )
}

export default App