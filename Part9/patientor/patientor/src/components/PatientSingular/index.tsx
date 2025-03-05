import { SyntheticEvent, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { Diagnosis, Patient, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from "../../types";
import patientService from "../../services/patients";
import { Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, SelectChangeEvent } from "@mui/material";
import { HealthAndSafety, Favorite, Work, LocalHospital, Male, Female, RadioButtonUnchecked } from "@mui/icons-material";

interface Props {
    diagnoses: Diagnosis[];
}

const PatientSingular = ({ diagnoses }: Props) => {
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
    const match = useMatch("/patients/:id");

    useEffect(() => {
        const fetchPatient = async () => {
            const foundPatient = await patientService.getOne(match?.params.id);
            setCurrentPatient(foundPatient);
        };
        fetchPatient();
    }, [match?.params.id]);

    if (!currentPatient || typeof match?.params.id !== "string") {
        return null;
    }

    const assertNever = (value: never): never => {
        throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
    };

    return (
        <div>
            <Typography variant="h5" style={{ marginTop: "0.5em" }}>
                <p>{currentPatient.name} {currentPatient.gender === "male" ? <Male />
                    : currentPatient.gender === "female" ? <Female /> : <RadioButtonUnchecked />}</p>
            </Typography>
            <Typography variant="subtitle2">
                <div>ssn: {currentPatient.ssn}</div>
                <div>occupation: {currentPatient.occupation}</div>
            </Typography>
            <NewEntryForm patientId={match?.params.id} currentPatient={currentPatient} setCurrentPatient={setCurrentPatient} />
            <Typography variant="h6">
                <p>entries</p>
            </Typography>
            <Typography variant="subtitle2">
                {currentPatient.entries?.map(entry => {
                    switch (entry.type) {
                        case "HealthCheck":
                            return <HealthCheckDiv key={entry.id} entry={entry} diagnoses={diagnoses} />;
                        case "OccupationalHealthcare":
                            return <OccupationalHealthcareDiv key={entry.id} entry={entry} diagnoses={diagnoses} />;
                        case "Hospital":
                            return <HospitalDiv key={entry.id} entry={entry} diagnoses={diagnoses} />;
                        default:
                            return assertNever(entry);
                    }
                })}
            </Typography>
        </div>
    );
};

interface EntryFormProps {
    patientId: string;
    currentPatient: Patient | null;
    setCurrentPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
}
const newEntryFormStyles = {
    padding: "5px",
    border: "2px dotted black"
};
const NewEntryForm = ({ patientId, setCurrentPatient }: EntryFormProps) => {
    const [errorCreationMessage, setErrorCreationMessage] = useState("");
    const match = useMatch("/patients/:id");

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [currentType, setCurrentType] = useState("");

    const [healthCheckRating, setHealthCheckRating] = useState("");

    const [employerName, setEmployerName] = useState("");
    const [sickLeaveSDate, setSickLeaveSDate] = useState("");
    const [sickLeaveEDate, setSickLeaveEDate] = useState("");

    const [dischargeDate, setDischargeDate] = useState("");
    const [dischargeCriteria, setDischargeCriteria] = useState("");

    /*const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
        if (!object || typeof object !== "object" || !("diagnosisCodes" in object) || typeof object.diagnosisCodes !== "string") {
            return [] as Array<Diagnosis["code"]>;
        }
        const codesArray: Array<Diagnosis["code"]> = object.diagnosisCodes.split(", ");
        return (codesArray);
    };*/

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        try {
            if (currentType === "") {
                throw new Error("Please select the type of entry");
            }
            if (currentType === "HealthCheck") {
                if (description === "" || date === "" || specialist === ""
                    || diagnosisCodes.length === 0 || healthCheckRating === "") {
                    throw new Error("Missing fields");
                }
                if (Number(healthCheckRating) < 0 || Number(healthCheckRating) > 3) {
                    throw new Error("Value of healthCheckingRate incorrect: " + healthCheckRating);
                }
                patientService.createEntry({
                    description,
                    date,
                    specialist,
                    diagnosisCodes,
                    type: currentType,
                    healthCheckRating: Number(healthCheckRating)
                }, patientId);
                const fetchPatient = async () => {
                    const foundPatient = await patientService.getOne(match?.params.id);
                    setCurrentPatient(foundPatient);
                };
                fetchPatient();
            } else if (currentType === "OccupationalHealthcare") {
                if (description === "" || date === "" || specialist === "" || diagnosisCodes.length === 0
                    || employerName === "" || sickLeaveSDate === "" || sickLeaveEDate === "") {
                    throw new Error("Missing fields");
                }
                patientService.createEntry({
                    description,
                    date,
                    specialist,
                    diagnosisCodes,
                    type: currentType,
                    employerName,
                    sickLeave: {
                        startDate: sickLeaveSDate,
                        endDate: sickLeaveEDate
                    }
                }, patientId);
                const fetchPatient = async () => {
                    const foundPatient = await patientService.getOne(match?.params.id);
                    setCurrentPatient(foundPatient);
                };
                fetchPatient();
            } else if (currentType === "Hospital") {
                if (description === "" || date === "" || specialist === "" || diagnosisCodes.length === 0
                    || dischargeDate === "" || dischargeCriteria === "") {
                    throw new Error("Missing fields");
                }
                patientService.createEntry({
                    description,
                    date,
                    specialist,
                    diagnosisCodes,
                    type: currentType,
                    discharge: {
                        date: dischargeDate,
                        criteria: dischargeCriteria
                    }
                }, patientId);
                const fetchPatient = async () => {
                    const foundPatient = await patientService.getOne(match?.params.id);
                    setCurrentPatient(foundPatient);
                };
                fetchPatient();
            }
        } catch (e) {
            if (e instanceof Error) {
                setErrorCreationMessage(e.message);
                setTimeout(() => {
                    setErrorCreationMessage("");
                }, 5000);
            }
        }
    };

    const handleSelectCodes = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
        event.preventDefault();
        const { target: { value } } = event;
        setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
    };

    const codes = [
        "M24.2",
        "M51.2",
        "S03.5",
        "J10.1",
        "J06.9",
        "Z57.1",
        "N30.0",
        "H54.7",
        "J03.0",
        "L60.1",
        "Z74.3",
        "L20",
        "F43.2",
        "S62.5",
        "H35.29"
    ];

    return (
        <div style={newEntryFormStyles}>
            <p style={{ color: "red" }}>{errorCreationMessage}</p>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6">
                    New Entry
                </Typography>
                <RadioGroup row name="typeRadGroup">
                    <FormControlLabel value={"HealthCheck"} label="HealthCheck" control={<Radio onChange={({ target }) => setCurrentType(target.value)} />} />
                    <FormControlLabel value={"OccupationalHealthcare"} label="OccupationalHealth" control={<Radio onChange={({ target }) => setCurrentType(target.value)} />} />
                    <FormControlLabel value={"Hospital"} label="Hospital" control={<Radio onChange={({ target }) => setCurrentType(target.value)} />} />
                </RadioGroup>
                <div><TextField label="Description" defaultValue={description} onChange={({ target }) => setDescription(target.value)} /></div>
                <div>Date<input type="date" onChange={({ target }) => setDate(target.value)} /></div>
                <div><TextField label="Specialist" defaultValue={specialist} onChange={({ target }) => setSpecialist(target.value)} /></div>

                <div>
                    <InputLabel>Diagnosis Codes</InputLabel>
                    <Select multiple value={diagnosisCodes} onChange={handleSelectCodes}>
                        {codes.map(code => (
                            <MenuItem key={code} value={code}>{code}</MenuItem>
                        ))}
                    </Select>
                </div>

                {currentType === "HealthCheck"
                    ? <div>
                        <div>
                            <InputLabel id="demo-simple-select-autowidth-label">HealthCheck Rating</InputLabel>
                            <Select onChange={({ target }) => setHealthCheckRating(target.value as string)} labelId="demo-simple-select-autowidth-label">
                                <MenuItem value={"0"}>0</MenuItem>
                                <MenuItem value={"1"}>1</MenuItem>
                                <MenuItem value={"2"}>2</MenuItem>
                                <MenuItem value={"3"}>3</MenuItem>
                            </Select>
                        </div>
                    </div>
                    : null}
                {currentType === "OccupationalHealthcare"
                    ? <div>
                        <div><TextField label="Employer name" defaultValue={employerName} onChange={({ target }) => setEmployerName(target.value)} /></div>
                        <div>
                            <div>Sick Leave Start Date<input type="date" onChange={({ target }) => setSickLeaveSDate(target.value)} /></div>
                            <div>Sick Leave End Date<input type="date" onChange={({ target }) => setSickLeaveEDate(target.value)} /></div>
                        </div>
                    </div>
                    : null}
                {currentType === "Hospital"
                    ? <div>
                        <div>Discharge Date<input type="date" onChange={({ target }) => setDischargeDate(target.value)} /></div>
                        <TextField label="Discharge criteria" defaultValue={dischargeCriteria} onChange={({ target }) => setDischargeCriteria(target.value)} />
                    </div>
                    : null}
                <div>
                    <Button variant="contained" color="error">CANCEL</Button>
                    <Button type="submit" variant="contained" color="primary">ADD</Button>
                </div>
            </form>
        </div>
    );
};


interface HealthCheckProps {
    entry: HealthCheckEntry;
    diagnoses: Diagnosis[];
}
interface OccupationalHealthProps {
    entry: OccupationalHealthcareEntry;
    diagnoses: Diagnosis[];
}
interface HospitalProps {
    entry: HospitalEntry,
    diagnoses: Diagnosis[]
}

const entryStyle = {
    border: "3px solid black",
    padding: "5px",
    marginBottom: "5px"
};
const HealthCheckDiv = ({ entry, diagnoses }: HealthCheckProps) => {
    return (
        <div style={entryStyle}>
            <div>{entry.date} <HealthAndSafety /></div>
            <i>{entry.description}</i>
            {entry.healthCheckRating === 0 ? <div><Favorite style={{ color: "green" }} /></div> : null}
            {entry.healthCheckRating === 1 ? <div><Favorite style={{ color: "yellow" }} /></div> : null}
            {entry.healthCheckRating === 2 ? <div><Favorite style={{ color: "orange" }} /></div> : null}
            {entry.healthCheckRating === 3 ? <div><Favorite style={{ color: "red" }} /></div> : null}
            <div>diagnosed by {entry.specialist}</div>
            <ul>
                {entry.diagnosisCodes?.map(dCode => {
                    const foundDiagnosis = diagnoses.find(d => d.code === dCode);
                    return (
                        <li key={dCode}>{dCode} {foundDiagnosis?.name}</li>
                    );
                })}
            </ul>
        </div>
    );
};
const OccupationalHealthcareDiv = ({ entry, diagnoses }: OccupationalHealthProps) => {
    return (
        <div style={entryStyle}>
            <div>{entry.date} <Work /> {entry.employerName}</div>
            <i>{entry.description}</i>
            <div>{entry.sickLeave ? <div>sick leave start: {entry.sickLeave?.startDate}</div> : null}</div>
            <div>{entry.sickLeave ? <div>sick leave end: {entry.sickLeave?.endDate}</div> : null}</div>
            <div>diagnosed by {entry.specialist}</div>
            <ul>
                {entry.diagnosisCodes?.map(dCode => {
                    const foundDiagnosis = diagnoses.find(d => d.code === dCode);
                    return (
                        <li key={dCode}>{dCode} {foundDiagnosis?.name}</li>
                    );
                })}
            </ul>
        </div>
    );
};
const HospitalDiv = ({ entry, diagnoses }: HospitalProps) => {
    return (
        <div style={entryStyle}>
            <div>{entry.date} <LocalHospital /></div>
            <i>{entry.description}</i>
            <div>discharge date: {entry.discharge.date} | discharge criteria: {entry.discharge.criteria}</div>
            <div>diagnosed by {entry.specialist}</div>
            <ul>
                {entry.diagnosisCodes?.map(dCode => {
                    const foundDiagnosis = diagnoses.find(d => d.code === dCode);
                    return (
                        <li key={dCode}>{dCode} {foundDiagnosis?.name}</li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PatientSingular;