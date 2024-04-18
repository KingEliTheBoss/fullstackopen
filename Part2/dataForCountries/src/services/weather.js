import axios from "axios"
const baseURL = "https://api.openweathermap.org/data/2.5/weather"
const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = (country) => {
    const request = axios.get(baseURL, {
        params: {
            appid: api_key,
            lat: country.capitalInfo.latlng[0],
            lon: country.capitalInfo.latlng[1],
            units: "metric"
        }
    })
    return request.then(response => response.data)
}

export default { getWeather }