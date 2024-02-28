import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Person = ({name, number}) => {
  return (
    <>
      <li>{name} {number}</li>
    </>
  )
}

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Notification = ({message}) => {
  if (!message) {
    return null
  }
  return (
    <div className='notif'>
      {message}
    </div>
  )
}

const ErrorMessage = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className='error'>
      {error}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber,
      id: `${persons.length + 1}`
    }
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmChange = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if(confirmChange) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }
        personsService
        .update(existingPerson.id, updatedPerson)
        .then(() => {
          setPersons(persons.map(person =>
            person.id !== existingPerson.id ? person : updatedPerson
          ))
          setMessage(`Updated ${newName}`)
          setTimeout(() => {
            setMessage(null)
          },5000)
        })
        .catch(error => {
          setError(`Information of ${newName} has already been deleted from server`)
          setTimeout(() => {
            setMessage(null)
          },5000)
        })
      }
    }
    else {
      personsService
      .create(person)
      .then(response => {
        setPersons(persons.concat(response))
        setMessage(`Added ${newName}`)
        setTimeout(() => {
          setMessage(null)
        },5000)
      })
      .catch(error => {
        setError(`Failed to add ${newName}`)
          setTimeout(() => {
            setMessage(null)
          },5000)
      })
    }
    setNewName('')
    setNewNumber('')
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

const handleDelete = (id) => {
  const personToDelete = persons.find(person => person.id === id)
  const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`)
  if (confirmDelete) {
    personsService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        console.log(error)
      })
  }
}

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <ErrorMessage error={error} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <div key={person.id}>
            <Person name={person.name} number={person.number} />
            <button onClick={() => handleDelete(person.id)}>Delete</button>
        </div>
        ))}
      </ul>
    </div>
  )
}

export default App