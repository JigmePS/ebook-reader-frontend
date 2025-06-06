import '../CSS/Category.css'

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import RecommendedItem from "./RecommendedItem.jsx";

function Recommendations() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = new URL(`http://localhost:8080/user/recommended`);

        fetch(url.toString(), {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch books');
                return response.json();
            })
            .then(data => setBooks(data))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="category-container">
            <div className="category">
                <div className="category-info">
                    <div className="category-title">Recommendations</div>
                </div>
            </div>

            <div className="category-content">
                {loading && <div className="category-message">Loading recommendations...</div>}
                {!loading && error && (
                    <div className="category-message">Error: {error}</div>
                )}
                {!loading && !error && books.length === 0 && (
                    <div className="category-message">
                        Nothing to recommend at the moment. Try adding more books to your library!
                    </div>
                )}
                {!loading && books.length > 0 && books.map((book, index) => (
                    <RecommendedItem key={index} data={book} />
                ))}
            </div>
        </section>
    );
}

export default Recommendations;
