import patients from "../../data/patientsEntries";
import { Patient, NewPatient, NonSensitivePatient, EntryWithoutId, Entry } from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): Patient[] => {
    return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id, name, dateOfBirth, gender, occupation, entries
    }));
};

const getPatient = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
    const newPatientEntry = {
        id: uuid(),
        ...entry
    };
    patients.push(newPatientEntry);
    return newPatientEntry;
};

const addEntry = (entry: EntryWithoutId, id: string): Entry => {
    const newEntry = {
        id: uuid(),
        ...entry
    };
    patients.find(patient => patient.id === id)?.entries?.push(newEntry);
    return newEntry;
};

export default {
    getPatients, getNonSensitivePatients, addPatient, getPatient, addEntry
};