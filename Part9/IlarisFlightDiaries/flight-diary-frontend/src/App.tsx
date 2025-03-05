import { useState, useEffect } from "react";
import { Diary } from "./types";
import Diaries from "./components/Diaries";
import { getAllDiaries } from "./services/diariesService";
import NewDiaryForm from "./components/NewDiaryForm";

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    })
  }, []);

  if (!diaries) {
    return null;
  }


  return (
    <div>
      <NewDiaryForm diaries={diaries} setDiaries={setDiaries} />
      <Diaries diaries={diaries} />
    </div>
  )
};

export default App;