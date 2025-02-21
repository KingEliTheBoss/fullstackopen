import axios from 'axios'
const baseURL = "https://studies.cs.helsinki.fi/restcountries/api/name"

const getCountryByName = (name) => {
    const request = axios.get(`${baseURL}/${name}`)
    return request.then(response => response.data)
}

export default { getCountryByName }