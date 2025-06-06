import {Link} from "react-router-dom";
import "../CSS/Search.css";
import React from "react";
import {Rating} from "react-simple-star-rating";

function SearchResults({books}) {
    return (
        <div className="book-list">
            {books.length === 0 ? (
                <p>No results found.</p>
            ) : (
                books.map(book => (
                    <Link
                        to={`/book/${book.id}-${book.title.replaceAll(" ", "-").toLowerCase()}`}
                        key={book.id}
                        className="book-item"
                    >
                        <img
                            src={`data:image/jpeg;base64,${book.coverImage}`}
                            alt="cover"
                            className="book-cover"
                        />
                        <div className="book-info">
                            <div className="search-book-top">
                                <div className="search-book-title">{book.title}</div>
                                <div className="search-book-author">{book.author}</div>
                                <div className="search-book-price">${book.price}</div>
                            </div>
                            <div className="search-book-genres">
                                {book.genres.map(g => g.name).join(", ")}
                            </div>
                            <div className="book-rating">
                                <Rating
                                    readonly
                                    initialValue={book.averageRating || 0}
                                    size={20}
                                    fillColor="#ffd700"
                                    emptyColor="#ccc"
                                />
                                <span style={{marginLeft: 6}}>
    {(book.averageRating || 0).toFixed(1)}
  </span>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}

export default SearchResults;