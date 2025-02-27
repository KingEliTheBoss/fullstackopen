import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

export const updateCache = (cache, query, addedPerson) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k)
    })
  };

  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson))
    }
  })
};

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const result = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);
  const client = useApolloClient();

  useEffect(() => {
    setToken(localStorage.getItem("library-user-token"))
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({data, client})=>{
      const addedBook = data.data.bookAdded;
      window.alert(`Book: "${addedBook.title}" was added`);
      updateCache(client.cache, {query: ALL_BOOKS}, addedBook);
    }
  })

  if (result.loading || resultBooks.loading) {
    return (
      <div>
        <div>loading...</div>
      </div>
    )
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => navigate("/authors")}>authors</button>
          <button onClick={() => navigate("/books")}>books</button>
          <button onClick={() => navigate("/login")}>login</button>
        </div>

        <Routes>
          <Route path="/authors" element={<Authors authors={result.data.allAuthors} />} />
          <Route path="/books" element={<Books books={resultBooks.data.allBooks} />} />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
        </Routes>
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => navigate("/authors")}>authors</button>
        <button onClick={() => navigate("/books")}>books</button>
        <button onClick={() => navigate("/addBook")}>add book</button>
        <button onClick={()=> navigate("/recommended")}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>


      <Routes>
        <Route path="/authors" element={<Authors authors={result.data.allAuthors} />} />
        <Route path="/books" element={<Books books={resultBooks.data.allBooks} />} />
        <Route path="/addBook" element={<NewBook />} />
        <Route path="/recommended" element={<Recommendations />} />
      </Routes>
    </div>
  );
};

export default App;
