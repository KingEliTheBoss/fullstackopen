import { useState, useEffect } from 'react'
import numberService from "./services/numbers"
import "./index.css"

const Filter = ({ value, onChange }) => {
    return (
        <div>
            <p>filter shown with <input value={value} onChange={onChange} /></p>
        </div>
    )
}

const PersonForm = ({ onSubmit, newName, newNumber, handleNameChange, handleNumberChange }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>name: <input value={newName} onChange={handleNameChange} /></div>
            <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

const People = ({ items, deleteNumber }) => {
    return (
        items.map(person =>
            <p key={person.name}>{person.name} {person.number}  <button onClick={() => deleteNumber(person)}>delete</button></p>
        )
    )
}

const Notif = ({ message, type }) => {
    if (message === null) {
        return null
    }
    return (
        <div className={type}>
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [personsToShow, setPersonsToShow] = useState(persons)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState("")
    const [newFilter, setNewFilter] = useState("")
    const [notifMessage, setNotifMessage] = useState(null)
    const [notifType, setNotifType]=useState("success")

    useEffect(() => {
        numberService
            .getAll()
            .then(initialNumbers => {
                setPersons(initialNumbers)
                setPersonsToShow(initialNumbers)
            })
    }, [])

    const submitInfo = (event) => {
        event.preventDefault()
        const foundPerson = persons.find(p => p.name == newName)
        if (foundPerson !== undefined) {
            if (window.confirm(`${foundPerson.name} ya se ha agregado, deseas reemplazar el número`)) {
                const updatePerson = { ...foundPerson, number: newNumber }
                numberService
                    .updateNumber(foundPerson.id, updatePerson)
                    .then(updatedPerson => {
                        setNotifType("success")
                        setNotifMessage(`${updatePerson.name} fue modificado correctamente`)
                        setTimeout(() => {
                            setNotifMessage(null)
                        }, 3000)
                        setPersons(persons.map(p => p.id !== foundPerson.id ? p : updatedPerson))
                        setPersonsToShow(persons.map(p => p.id !== foundPerson.id ? p : updatedPerson))
                    })
                    .catch(error => {
                        setNotifType("error")
                        setNotifMessage(`${foundPerson.name} was already deleted from server`)
                        setTimeout(() => {
                            setNotifMessage(null)
                        }, 3000)
                        setPersons(foundPerson.filter(n => n.id !== id))
                        setPersonsToShow(foundPerson.filter(n => n.id !== id))
                    })
            }
            else {
                setPersons(persons)
                setPersonsToShow(persons)
                setNewName(newName)
                setNewNumber(newNumber)
            }
        }
        else {
            const object = {
                name: newName,
                number: newNumber
            }
            numberService
                .create(object)
                .then(returnedNumber => {
                    setNotifType("success")
                    setNotifMessage(`${returnedNumber.name} fue creado correctamente`)
                    setTimeout(() => {
                        setNotifMessage(null)
                    }, 3000)
                    setPersons(persons.concat(returnedNumber))
                    setPersonsToShow(persons.concat(returnedNumber))
                    setNewName("")
                    setNewNumber("")
                    setNewFilter("")
                })
                .catch(error => {
                })
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

    const deleteNumber = (person) => {
        if (window.confirm(`¿Estás seguro que quieres eliminar ${person.name}?`)) {
            numberService
                .deleteNumber(person.id)
                .then(deletedNumber => {
                    setNotifType("success")
                    setNotifMessage(`${person.name} fue eliminado correctamente`)
                    setTimeout(() => {
                        setNotifMessage(null)
                    }, 3000)
                    setPersons(persons.filter(p => p.id !== deletedNumber.id))
                    setPersonsToShow(persons.filter(p => p.id !== deletedNumber.id))
                })
                .catch(error => {
                    setNotifType("error")
                    setNotifMessage(`${person.name} was already deleted from server`)
                    setTimeout(() => {
                        setNotifMessage(null)
                    }, 3000)
                    setPersons(persons.filter(p => p.id !== person.id))
                    setPersonsToShow(persons.filter(p => p.id !== person.id))
                })

        }
    }

    return (
        <div>
            <h1>Phonebook</h1>
            <Notif message={notifMessage} type={notifType} />
            <Filter value={newFilter} onChange={handleFilterChange} />
            <h2>add a new</h2>
            <PersonForm onSubmit={submitInfo} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <People items={personsToShow} deleteNumber={deleteNumber} />
        </div>
    )
}

export default App