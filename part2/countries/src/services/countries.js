import axios from 'axios'
const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryByNameUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name'

const getAll = () => {
    return axios.get(allCountriesUrl)
        .then(response => response.data)
}

const getCountryByName = (name) => {
    return axios.get(`${countryByNameUrl}/${name}`)
        .then(response => response.data)
}

export default {
    getAll,
    getCountryByName
}