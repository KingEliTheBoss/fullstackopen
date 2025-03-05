import express, { Request, Response, NextFunction } from "express";
import { NonSensitivePatient, NewPatient, Patient, Entry, EntryWithoutId } from "../types";
import patientService from "../services/patientService";
import { newPatientEntrySchema } from "../utils";
import { z } from "zod";

const router = express.Router();

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        newPatientEntrySchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

/*const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
    if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
        return [] as Array<Diagnosis["code"]>;
    }

    return object.diagnosisCodes as Array<Diagnosis["code"]>;
};*/

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientService.getNonSensitivePatients());
});

router.get("/:id", (req: Request, res: Response<Patient>) => {
    res.send(patientService.getPatient(req.params.id));
});

router.post("/", newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
});

router.post("/:id/entries", (req: Request<{ id: string }, unknown, EntryWithoutId>, res: Response<Entry>) => {
    const addedEntry = patientService.addEntry(req.body, req.params.id);
    res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;