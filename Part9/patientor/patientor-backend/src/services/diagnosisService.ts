import diagnoses from "../../data/diagnosesEntries";
import { Diagnosis } from "../types";

const getDiagnoses = (): Diagnosis[]=>{
    return diagnoses;
};

export default{
    getDiagnoses
};