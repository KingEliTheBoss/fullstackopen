import axios from "axios";
import { Diary, NewDiary } from "../types";

const baseUrl = "http://localhost:3000/api";


export const getAllDiaries = () => {
    return axios
        .get(`${baseUrl}/diaries`)
        .then(response => response.data);
};

export const createDiary = (diaryObject: NewDiary) => {
    return axios
        .post<Diary>(`${baseUrl}/diaries`, diaryObject)
        .then(response => response.data);
};

export default{
    getAllDiaries, createDiary
};