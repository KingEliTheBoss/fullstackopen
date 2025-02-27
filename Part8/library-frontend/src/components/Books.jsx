import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = ({books}) => {
  const [genreFilter, setGenreFilter] = useState("");
  const filteredbooks = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter }
  });

  if(filteredbooks.loading){
    return <div>loading</div>;
  }

  const allGenres = Array.from(new Set(books.flatMap(book => book.genres)));

  const handleGenre = (gen)=>{
    setGenreFilter(gen);
    filteredbooks.refetch();
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredbooks.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {allGenres.map(genre => <button key={genre} onClick={()=>handleGenre(genre)}>{genre}</button>)}
        <button onClick={() => setGenreFilter("")}>all genres</button>
      </div>
    </div>
  )
}

export default Books
