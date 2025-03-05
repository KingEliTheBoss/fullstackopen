import { z } from "zod";
import { NewDiary, Visibility, Weather } from "./types";

export const newDiarySchema = z.object({
    date: z.string().date(),
    visibility: z.nativeEnum(Visibility),
    weather: z.nativeEnum(Weather),
    comment: z.string().optional(),
});

const toNewDiary = (object: unknown): NewDiary => {
    return newDiarySchema.parse(object);
};

export default toNewDiary;