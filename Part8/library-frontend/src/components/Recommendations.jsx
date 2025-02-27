import { useQuery } from "@apollo/client";
import { CURRENTUSER, ALL_BOOKS } from "../queries";
import { useEffect, useState } from "react";

const Recommendations = () => {
    const [favoriteGenre, setFavoriteGenre] = useState("");
    const currentUserRes = useQuery(CURRENTUSER);
    const filteredbooks = useQuery(ALL_BOOKS, {
        variables: { genre: favoriteGenre }
    });

    useEffect(() => {
        if(currentUserRes.data){
            setFavoriteGenre(currentUserRes.data.me.favoriteGenre);
        }
    }, [currentUserRes.data]);


    if (currentUserRes.loading || filteredbooks.loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <h2>recommendations</h2>
            <div>books in your favorite genre <strong>{favoriteGenre}</strong></div>
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
        </div>
    )
};

export default Recommendations;