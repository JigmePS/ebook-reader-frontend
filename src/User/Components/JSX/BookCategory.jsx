import '../CSS/Category.css'

import BookItem from "./BookItem.jsx";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

function BookCategory({ title, apiUrl, limit }) {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const url = new URL(`http://localhost:8080${apiUrl}`);
        if (limit) {
            url.searchParams.set('limit', limit);
        }

        fetch(url.toString())
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch books');
                return response.json();
            })
            .then(data => setBooks(data))
            .catch(error => console.error(error));
    }, [apiUrl, limit]);


    return (
        <section className="category-container">
            <div className="category">
                <div className="category-info">
                    <div className="category-title">{title}</div>
                    <div className="category-expand">
                        <Link
                            className={"category-expand-link"}
                            to={`/${title.toLowerCase().replace(/\s/g, '-')}`}>
                            See More
                        </Link>
                    </div>
                </div>
            </div>

            <div className="category-content">
                {books.map((book, index) => (
                    <BookItem key={index} data={book}/>
                ))}
            </div>
        </section>
    );
}

export default BookCategory;