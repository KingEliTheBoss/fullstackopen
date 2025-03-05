import { z } from "zod";
import { NewDiaryEntry, Visibility, Weather } from "./types";

export const newEntrySchema = z.object({
    comment: z.string().optional(),
    date: z.string().date(),
    weather: z.nativeEnum(Weather),
    visibility: z.nativeEnum(Visibility)
});

const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
    return newEntrySchema.parse(object);
};

export default toNewDiaryEntry;