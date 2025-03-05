import React, { useState } from "react";
import { Diary, Visibility, Weather } from "../types";
import { createDiary } from "../services/diariesService";
import axios from "axios";

interface Props {
    diaries: Diary[],
    setDiaries: React.Dispatch<React.SetStateAction<Diary[]>>
}

const NewDiaryForm = ({ diaries, setDiaries }: Props) => {
    const [date, setDate] = useState("");
    const [visibility, setVisibility] = useState("great");
    const [weather, setWeather] = useState("sunny");
    const [comment, setComment] = useState("");

    const [error, setError] = useState("");

    const addNewDiary = (event: React.SyntheticEvent) => {
        event.preventDefault();

        console.log(visibility, weather)

        const visibilityV = Object.values(Visibility).find(v => v.toString() === visibility);
        const weatherW = Object.values(Weather).find(w => w.toString() === weather);

        if (!visibilityV) {
            setError(`Error: Incorrect visibility: ${visibility}`);
            setTimeout(() => {
                setError("");
            }, 5000);
        } else if (!weatherW) {
            setError(`Error: Incorrect weather: ${weather}`);
            setTimeout(() => {
                setError("");
            }, 5000);
        } else {
            createDiary({
                date,
                weather: weatherW,
                visibility: visibilityV,
                comment
            }).then(data => {
                setDiaries(diaries.concat(data));
            }).catch(e => {
                if (axios.isAxiosError(e)) {
                    if (e.response) {
                        setError(e.response.data);
                        setTimeout(() => {
                            setError("");
                        }, 5000);
                    }
                }
            })
        }

    };

    /*const onWeatherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (typeof event.target.value === "string") {
            const value = event.target.value;
            const weather = Object.values(Weather).find(w => w.toString() === value);
            if (weather) {
                setWeather(weather);
            }
        }
    };
    const onVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (typeof event.target.value === "string") {
            const value = event.target.value;
            const visibility = Object.values(Visibility).find(v => v.toString() === value);
            //if (visibility) {
            setVisibility(visibility);
            //}
        }
    };*/

    const errorStyle = {
        color: "red"
    };

    return (
        <div>
            <h2>Add new entry</h2>
            <p style={errorStyle}>{error}</p>
            <form onSubmit={addNewDiary}>
                <div>date<input type="date" value={date} onChange={({ target }) => setDate(target.value)} /></div>
                <div>visibility
                    <input type="radio" id="visibilityRad1" name="visibilityRadios" checked value={"great"} onChange={({ target }) => setVisibility(target.value)} />
                    <label htmlFor={"visibilityRad1"}>great</label>
                    <input type="radio" id="visibilityRad2" name="visibilityRadios" value={"good"} onChange={({ target }) => setVisibility(target.value)} />
                    <label htmlFor={"visibilityRad2"}>good</label>
                    <input type="radio" id="visibilityRad3" name="visibilityRadios" value={"ok"} onChange={({ target }) => setVisibility(target.value)} />
                    <label htmlFor={"visibilityRad3"}>ok</label>
                    <input type="radio" id="visibilityRad4" name="visibilityRadios" value={"bad"} onChange={({ target }) => setVisibility(target.value)} />
                    <label htmlFor={"visibilityRad4"}>bad</label>
                </div>
                <div>weather
                    <input type="radio" id="weatherRad1" name="weatherRadios" checked value={"sunny"} onChange={({ target }) => setWeather(target.value)} />
                    <label htmlFor={"weatherRad1"}>sunny</label>
                    <input type="radio" id="weatherRad2" name="weatherRadios" value={"rainy"} onChange={({ target }) => setWeather(target.value)} />
                    <label htmlFor={"weatherRad2"}>rainy</label>
                    <input type="radio" id="weatherRad3" name="weatherRadios" value={"cloudy"} onChange={({ target }) => setWeather(target.value)} />
                    <label htmlFor={"weatherRad3"}>cloudy</label>
                    <input type="radio" id="weatherRad4" name="weatherRadios" value={"stormy"} onChange={({ target }) => setWeather(target.value)} />
                    <label htmlFor={"weatherRad4"}>stormy</label>
                    <input type="radio" id="weatherRad5" name="weatherRadios" value={"windy"} onChange={({ target }) => setWeather(target.value)} />
                    <label htmlFor={"weatherRad5"}>windy</label>
                </div>
                <div>comment<input value={comment} onChange={({ target }) => setComment(target.value)} /></div>
                <button type="submit">add</button>
            </form>
        </div>
    )
};

export default NewDiaryForm;