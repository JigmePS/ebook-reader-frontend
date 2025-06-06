import cover from '../../../assets/Cover.png';
import '../CSS/Book.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Shared/Context/AuthContext.jsx";
import {BookOpen01Icon, ShoppingBagAddIcon, ShoppingBagCheckIcon} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import LoginModal from "./LoginModal.jsx";
import { Rating } from "react-simple-star-rating";
import { useLibrary } from "../../Context/LibraryContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { toast } from "react-toastify";

function BookIntroduction({ book }) {
    const { sessionData } = useAuth();
    const { libraryData, fetchLibraryData } = useLibrary();
    const { cartData, fetchCartData } = useCart();

    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const matchedLibraryItem = libraryData?.find(item => item.bookid === book.id);
    const bookProgress = matchedLibraryItem?.bookprogress ?? 0;
    const libraryBookId = matchedLibraryItem?.librarybookid;

    const isInLibrary = !!matchedLibraryItem;
    const isInCart = cartData?.some(item => item.book?.bookid === book.id);

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/user/cart/add",
                { bookId: book.id },
                { withCredentials: true }
            );
            toast.success(response.data || "Added to basket");
            fetchCartData(); // refresh cart context
        } catch (err) {
            toast.error("Failed to add to basket");
        }
    };

    const handleStartOrContinueReading = async () => {
        const chapterNo = bookProgress === 0 ? 1 : bookProgress;
        try {
            await axios.put(`http://localhost:8080/user/book/${book.id}/view`, {}, {
                withCredentials: true
            });

            navigate(`/chapter/${book.id}/${chapterNo}`);
        } catch (err) {
            toast.error("Failed to open chapter");
        }
    };

    return (
        <section className="book-introduction">
            <div className="book-intro-container">
                <div className="book-intro-left">
                    <div className="main-book-cover-container">
                        <img
                            className="main-book-cover-img"
                            src={`data:image/jpeg;base64,${book.coverImage}`}
                            alt={book.booktitle}
                        />
                    </div>
                </div>
                <div className="book-intro-right">
                    <div className="book-intro-info">
                        <div className="book-intro-content">
                            <div className="book-title">{book.title}</div>
                            <div className="book-author">
                                Author: {" "}
                                <Link to={`/author/${encodeURIComponent(book.author)}`}>
                                    {book.author}
                                </Link>
                            </div>
                            <div className="book-genre">
                                Genre: {
                                book.genres.map((g, index) => (
                                    <span className="book-genre-link" key={g.id}>
                                            <Link
                                                className="book-genre-link"
                                                to={`/genre/${g.id}-${g.name.replaceAll(" ", "-").toLowerCase()}`}
                                            >
                                                {g.name}
                                            </Link>{index < book.genres.length - 1 && ', '}
                                        </span>
                                ))
                            }
                            </div>
                            <div className="book-chapter-count">
                                {(book.chapters?.length || 0)} {(book.chapters?.length === 1 ? "Chapter" : "Chapters")}
                            </div>
                            <div className="book-rating">
                                <Rating
                                    readonly
                                    initialValue={book.averageRating || 0}
                                    size={20}
                                    fillColor="#ffd700"
                                    emptyColor="#ccc"
                                />
                                <span style={{ marginLeft: 8 }}>
                                    {book.averageRating?.toFixed(1) || 0} / 5
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="book-intro-action-container">
                        {sessionData ? (
                            <>
                                {isInLibrary ? (
                                    <div className="book-intro-action">
                                        <button
                                            onClick={handleStartOrContinueReading}
                                            className="book-intro-action-btn book-intro-read"
                                        >
                                            <HugeiconsIcon icon={BookOpen01Icon} />
                                            {bookProgress === 0 ? "Start Reading" : "Continue Reading"}
                                        </button>
                                    </div>
                                ) : isInCart ? (
                                    <div className="book-intro-action">
                                        <button
                                            className="book-intro-action-btn book-intro-basket" disabled
                                        >
                                            <HugeiconsIcon icon={ShoppingBagCheckIcon} />
                                            In the Basket
                                        </button>
                                    </div>
                                ) : (
                                    <div className="book-intro-action">
                                        <button
                                            onClick={handleAddToCart}
                                            className="book-intro-action-btn book-intro-add-basket"
                                        >
                                            <HugeiconsIcon icon={ShoppingBagAddIcon} />
                                            Add to Basket
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="book-intro-action">
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="book-intro-action-btn book-intro-add-basket"
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add to Basket
                                </button>
                            </div>
                        )}

                        {showLoginModal && (
                            <LoginModal onClose={() => setShowLoginModal(false)} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BookIntroduction;
