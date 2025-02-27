import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_BIRTHYEAR, ALL_AUTHORS } from "../queries";

const Authors = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [changeBirthYear, result] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  const setBirthYear = (event) => {
    event.preventDefault();

    let selectValue = document.getElementById("selectID").value;

    changeBirthYear({ variables: { name: selectValue, setBornTo: parseInt(born) } });

    setName("");
    setBorn("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      //setError("person not found");
    }
  }, [result.data]);

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={setBirthYear}>
        <select id="selectID">
          {authors.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
        <div>
          born <input value={born} onChange={(e) => setBorn(e.target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
