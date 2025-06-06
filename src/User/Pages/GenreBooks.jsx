import BookListHeader from "../Components/JSX/BookListHeader.jsx";
import {useEffect, useState} from "react";
import SearchResults from "../Components/JSX/SearchResults.jsx";
import {useParams} from "react-router-dom";

function GenreBooks() {
    const { genreId } = useParams();
    const actualGenreId = genreId.split("-")[0];

    const [results, setResults] = useState([]);
    const [genreName, setGenreName] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/user/genres/${actualGenreId}/books`)
            .then(async res => {
                const text = await res.text();
                if (!text) {
                    setResults([]);
                    return;
                }
                try {
                    const data = JSON.parse(text);
                    setResults(data);

                    // Try to get genre name from first book
                    if (data.length > 0) {
                        const matchedGenre = data[0].genres.find(g => g.id === parseInt(actualGenreId));
                        if (matchedGenre) setGenreName(matchedGenre.name);
                    }
                } catch (err) {
                    console.error("JSON parse error", err);
                    setResults([]);
                }
            })
            .catch(err => console.error("Fetch failed:", err));
    }, [genreId]);

    return (
        <>
            <BookListHeader title={`${genreName ? genreName + " " : ""}Genre Books`} />
            <div className="booklist-main-content-background">
                <div className="booklist-main-content">
                    <SearchResults books={results} />
                </div>
            </div>
        </>
    );
}

export default GenreBooks;