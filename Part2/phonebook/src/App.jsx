import { useState } from 'react'

const Filter = ({value, onChange}) => {
    return (
        <div>
            <p>filter shown with <input value={value} onChange={onChange} /></p>
        </div>
    )
}

const PersonForm = ({onSubmit, newName, newNumber, handleNameChange, handleNumberChange}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>name: <input value={newName} onChange={handleNameChange} /></div>
            <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

const People = ({items}) => {
    return (
        items.map(person =>
            <p key={person.name}>{person.name} {person.number}</p>
        )
    )
}

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: "040-1234567", id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [personsToShow, setPersonsToShow] = useState(persons)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState("")
    const [newFilter, setNewFilter] = useState("")

    const submitInfo = (event) => {
        event.preventDefault()
        const object = {
            name: newName,
            number: newNumber
        }

        if (persons.find(person => JSON.stringify(person) === JSON.stringify(object))) {
            setPersons(persons)
            setPersonsToShow(persons)
            setNewName(newName)
            setNewNumber(newNumber)
            alert(`${newName} or ${newNumber} are already added to the phonebook`)
        }
        else {
            setPersons(persons.concat(object))
            setPersonsToShow(persons.concat(object))
            setNewName("")
            setNewNumber("")
            setNewFilter("")
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setPersonsToShow(persons.filter((word) => word.name.toLowerCase().includes(event.target.value.toLowerCase())))
        setNewFilter(event.target.value)
    }

    return (
        <div>
            <h1>Phonebook</h1>
            <Filter value={newFilter} onChange={handleFilterChange} />
            <h2>add a new</h2>
            <PersonForm onSubmit={submitInfo} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <People items={personsToShow} />
        </div>
    )
}

export default App