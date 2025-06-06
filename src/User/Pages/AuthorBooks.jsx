import BookListHeader from "../Components/JSX/BookListHeader.jsx";
import SearchResults from "../Components/JSX/SearchResults.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function AuthorBooks() {
    const { authorName } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authorName) return;

        setLoading(true);
        setError(null);

        fetch(`http://localhost:8080/user/book/byauthor/all?author=${encodeURIComponent(authorName)}`, {
            credentials: "include", // send cookies/session info if needed
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log("Fetched author books:", data);
                setResults(data); // assuming data is an array of books
            })
            .catch(err => {
                console.error("Failed to fetch author books", err);
                setError("Failed to load books.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [authorName]);

    return (
        <>
            <BookListHeader title={`Books by ${authorName || "Unknown Author"}`} />
            <div className="booklist-main-content-background">
                <div className="booklist-main-content">
                    {loading && <p>Loading books...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && !error && <SearchResults books={results} />}
                    {!loading && !error && results.length === 0 && <p>No books found for this author.</p>}
                </div>
            </div>
        </>
    );
}

export default AuthorBooks;
