import express, { Response, Request, NextFunction } from "express";
import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from "../types";
import diaryService from "../services/diaryService";
//import toNewDiaryEntry from "../utils";
import { z } from "zod";
import { newEntrySchema } from "../utils";

const router = express.Router();

const newDiaryParser = (req: Request, _res: Response, next: NextFunction)=>{
    try{
        newEntrySchema.parse(req.body);
        next();
    } catch(error: unknown){
        next(error);
    }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction)=>{
    if(error instanceof z.ZodError){
        res.status(400).send({error: error.issues});
    } else {
        next(error);
    }
};


router.get("/", (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
    res.send(diaryService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
    const diary = diaryService.findById(Number(req.params.id));

    if (diary) {
        res.send(diary);
    } else {
        res.sendStatus(404);
    }
});

router.post("/", newDiaryParser, (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
    const addedEntry = diaryService.addDiary(req.body);
    res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;