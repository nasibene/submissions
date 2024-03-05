import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    find countries <input value={filter} onChange={handleFilterChange} />
  </div>
)

const Country = ({name, capital, area, languages, flag}) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>capital : {capital}</p>
      <p>area : {area}</p>
      <h3>languages :</h3>
      <ul>
        {languages && languages.length > 0 ? (
          languages.map((language, index) => (
            <li key={index}>{language}</li>
          ))
        ) : (
          <li>No languages found</li>
        )}
      </ul>
      <img src={flag}/>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const showCountry = (name) => {
    const countryName = name.common
    countriesService.getCountryByName(countryName)
      .then(country => {
        setSelectedCountry(country[0])
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length > 1 && filteredCountries.length < 11 ? (
        <ul>
          {filteredCountries.map((country, index) => (
            <div key={index}>
              <li>{country.name.common}</li>
              <button onClick={() => showCountry(country.name)}>Show</button>
            </div>
          ))}
        </ul>
      ) : (
        <>
          {selectedCountry ? (
            <Country
              name={selectedCountry.name.common}
              capital={selectedCountry.capital}
              area={selectedCountry.area}
              languages={Object.values(selectedCountry.languages)}
              flag={selectedCountry.flags.png}
            />
          ) : (
            filteredCountries.map((country, index) => (
              <div key={index}>
                <Country
                  name={country.name.common}
                  capital={country.capital}
                  area={country.area}
                  languages={Object.values(country.languages)}
                  flag={country.flags.png}
                />
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}

export default App
