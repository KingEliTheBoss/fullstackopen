import { Diary } from "../types";

interface Props {
    diaries: Diary[]
}

const Diaries = ({ diaries }: Props) => {
    return (
        <div>
            <h2>Diary entries</h2>
            {diaries.map(diary => (
                <div key={diary.id}>
                    <h3>{diary.date}</h3>
                    <div>visibility: {diary.visibility}</div>
                    <div>weather: {diary.weather}</div>
                </div>
            ))}
        </div>
    )
};

export default Diaries;