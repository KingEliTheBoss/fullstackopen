import { useState, useEffect } from 'react'
import countriesService from "./services/countries"
import weatherService from "./services/weather"

const CountryFilter = ({ value, onChange }) => {
    return (
        <p>find countries <input value={value} onChange={onChange}></input></p>
    )
}

const CountryWeather = ({ country }) => {
    const [weather, setWeather] = useState([])

    useEffect(() => {
        weatherService
            .getWeather(country)
            .then(weatherRes => {
                setWeather(weatherRes)
            })
    }, [country.capitalInfo.latlng])

    if (weather.length === 0) {
        return null
    }
    /*return (
        <div>
            <h1>Weather in {country}</h1>
            <p>temperature {weather.main.temp} °C</p>
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.weather[0].description} />
            <p>wind {weather.wind.speed} m/s</p>
        </div>
    )*/
}

const Country = ({ country }) => {
    const langKeys = Object.keys(country.languages)
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3><strong>languages:</strong></h3>
            <ul>
                {langKeys.map(langs =>
                    <li key={country.languages[langs]}>{country.languages[langs]}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt}></img>
            <CountryWeather country={country} />
        </div>
    )
}

const ShowCountries = ({ items, onClick }) => {
    if (items.length == 0) {
        return null
    }
    else if (items.length == 1) {
        return <Country country={items[0]} />
    }
    else if (items.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }
    return (
        items.map(country =>
            <p key={country.name.official}>{country.name.common} <button onClick={onClick}>show</button></p>
        )
    )
}

const App = () => {
    const [allCountries, setAllCountries] = useState(null)
    const [multipleCountries, setMultipleCountries] = useState([])
    const [newFilter, setNewFilter] = useState("")

    useEffect(() => {
        countriesService
            .getAll()
            .then(initialCountries => {
                setAllCountries(initialCountries)
            })
    }, [])

    if (!allCountries) {
        return null
    }
    

    const handleFilterChange = (event) => {
        if (event.target.value == "") {
            setMultipleCountries("")
        } else {
            setMultipleCountries(allCountries.filter(c => c.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
        }
        setNewFilter(event.target.value)
    }

    const showExtraCountry = (event) => {
        setNewFilter(event.target.parentElement.firstChild.data)
        setMultipleCountries(allCountries.filter(c => c.name.common.toLowerCase().includes(event.target.parentElement.firstChild.data.toLowerCase())))
    }

    return (
        <div>
            <CountryFilter value={newFilter} onChange={handleFilterChange} />
            <ShowCountries items={multipleCountries} onClick={showExtraCountry} />
        </div>
    )
}

export default App
