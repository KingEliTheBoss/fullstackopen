import { z } from "zod";
import { NewPatient, Gender, Entry } from "./types";

export const newPatientEntrySchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string(),
    gender: z.nativeEnum(Gender),
    occupation: z.string(),
    entries: z.custom<Entry>().array().optional()
});

const toNewPatientEntry = (object: unknown): NewPatient => {
    return newPatientEntrySchema.parse(object);
};

export default toNewPatientEntry;