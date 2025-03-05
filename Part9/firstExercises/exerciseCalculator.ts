interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
};

interface exerciseValues {
    target: number,
    dailyHours: number[]
};

const parseArgumentsExercises = (args: string[]): exerciseValues => {
    if (args.length < 4) throw new Error("Not enough arguments");
    const dailyHours = args.slice(3).map(str => Number(str));

    dailyHours.forEach(dayHours => {
        if (isNaN(dayHours)){
            throw new Error("Provided values were not numbers !");
        }
    });

    if (!isNaN(Number(args[2]))) {
        return {
            target: Number(args[2]),
            dailyHours
        };
    } else {
        throw new Error("Provided values were not numbers!");
    }
};

export const calculateExercises = (dailyHours: number[], target: number): Result => {
    const periodLength: number = dailyHours.length;
    let trainingDays: number = 0;

    let sum: number = 0;
    dailyHours.forEach(dayHours => {
        if (dayHours !== 0) trainingDays++;
        sum += dayHours;
    });
    const average: number = sum / periodLength;

    const success: boolean = average >= target;

    let rating: number = 0;
    let ratingDescription: string = "Get out of my class you fool!";

    const ratingDivision: number = target / 2;
    if (average > 0 && average < ratingDivision) {
        rating = 1;
        ratingDescription = "I'm not mad, just disappointed.";
    } else if (average >= ratingDivision && average < target) {
        rating = 2;
        ratingDescription = "Who are you? You don't stand out in either way.";
    } else if (average >= target) {
        rating = 3;
        ratingDescription = "Someone get NASA on the horn, this guy is a genius!";
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

/*const hoursTaken: number[] = [3, 0, 2, 4.5, 0, 3, 1];
const targetHours: number = 2;*/

try{
    const {target, dailyHours} = parseArgumentsExercises(process.argv);
    console.log(calculateExercises(dailyHours, target));
} catch(error){
    let errorMessage = "Something bad happened.";
    if(error instanceof Error){
        errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
}