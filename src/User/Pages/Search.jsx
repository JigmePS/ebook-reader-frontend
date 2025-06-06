import "../Background.css";
import SearchResults from "../Components/JSX/SearchResults.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Components/CSS/Search.css"

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);

    // Parse query params fresh from location.search on every render
    const params = new URLSearchParams(location.search);
    const query = params.get("keyword");
    const sort = params.get("sortBy") || "relevance";

    useEffect(() => {
        if (!query) return;

        fetch(`http://localhost:8080/user/search?keyword=${query}&sortBy=${sort}`)
            .then(async (res) => {
                const text = await res.text();
                console.log("Backend raw response:", text);
                if (!text) {
                    setResults([]);
                    return;
                }
                try {
                    const data = JSON.parse(text);
                    console.log("Parsed:", data);
                    setResults(data);
                } catch (err) {
                    console.error("JSON parse error", err);
                    setResults([]);
                }
            })
            .catch((err) => {
                console.error("Fetch failed:", err);
                setResults([]);
            });
    }, [location.search]); // Trigger fetch on any change to the query string

    return (
        <>
            <div className="booklist-content-background">
                <div className="booklist-content">
                    Search Results for "{query}"
                    <select
                        value={sort}
                        className="search-sort-select"
                        onChange={(e) =>
                            navigate(`/search?keyword=${query}&sortBy=${e.target.value}`)
                        }
                    >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                        <option value="highest-rated">Highest Rated</option>
                        <option value="most-viewed">Most Viewed</option>
                    </select>
                </div>
            </div>
            <div className="booklist-main-content-background">
                <div className="booklist-main-content">
                    <SearchResults books={results} />
                </div>
            </div>
        </>
    );
}

export default Search;
