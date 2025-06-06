import '../Background.css'
import BookIntroduction from "../Components/JSX/BookIntroduction.jsx";
import BookContent from "../Components/JSX/BookContent.jsx";
import BookReview from "../Components/JSX/BookReview.jsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function Book() {

    const {id} = useParams();
    const bookId = id.split("-")[0];

    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/user/book/${bookId}`)
            .then(res => {
                setBook(res.data);
                setError(null);
            })
            .catch(err => {
                console.error("Failed to load book:", err);
                setError("Book not found or server error.");
            });
    }, [bookId]);

        console.log(book);
    if (error) return <div>{error}</div>;
    if (!book) return <div>Loading...</div>;

    return (
        <>
            <div className="book-content-background">
                <div className="book-content">
                    <BookIntroduction book={book}/>
                </div>
            </div>
            <div className="book-main-content-background">
                <div className="book-main-content">
                    <BookContent book={book}/>
                </div>
            </div>
        </>
    )
}

export default Book;