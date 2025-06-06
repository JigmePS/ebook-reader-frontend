import {useNavigate} from "react-router-dom";
import {Rating} from "react-simple-star-rating";
import React from "react";
import {useLibrary} from "../../Context/LibraryContext.jsx";
import "../CSS/Search.css";
import axios from "axios";

function LibraryItem() {
    const {libraryData} = useLibrary();
    const navigate = useNavigate();

    const handleReadClick = async (bookid, chapterNo) => {
        try {
            await axios.put(`http://localhost:8080/user/book/${bookid}/view`, {}, {
                withCredentials: true
            });
            navigate(`/chapter/${bookid}/${chapterNo}`);
        } catch (err) {
            console.error("Failed to increase view count or navigate:", err);
        }
    };

    return (
        <div className="book-list">
            {libraryData.length === 0 ? (
                <p>No books in your library.</p>
            ) : (
                libraryData.map(book => {
                    const chapterToRead = book.bookprogress === 0 ? 1 : book.bookprogress;
                    const actionLabel = book.bookprogress === 0 ? "Start Reading" : "Continue Reading";

                    return (
                        <div key={book.librarybookid} className="library-item">
                            <img
                                className="library-cover"
                                src={`data:image/jpeg;base64,${book.coverImage}`}
                                alt={book.booktitle || "Book Cover"}
                                onClick={() =>
                                    navigate(`/book/${book.bookid}-${book.booktitle.replaceAll(" ", "-").toLowerCase()}`)
                                }
                                style={{cursor: "pointer"}}
                            />
                            <div className="library-info">
                                <div className="library-info-top">
                                    <div
                                        onClick={() =>
                                            navigate(`/book/${book.bookid}-${book.booktitle.replaceAll(" ", "-").toLowerCase()}`)
                                        }
                                        className={"library-book-title"}
                                        style={{cursor: "pointer"}}
                                    >
                                        {book.booktitle || "Untitled"}
                                    </div>
                                    <div className="library-book-date">
                                        Added on: {new Date(book.addeddate).toLocaleDateString()}
                                    </div>
                                    <div className="library-book-progress">
                                        Progress: Chapter {book.bookprogress}
                                    </div>
                                </div>
                                <div className="library-info-bottom">
                                    <div className="library-book-action">
                                        <button
                                            className="library-book-action-link"
                                            onClick={() => handleReadClick(book.bookid, chapterToRead)}
                                        >
                                            {actionLabel}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default LibraryItem;
