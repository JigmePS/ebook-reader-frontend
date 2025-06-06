import '../CSS/Book.css'
import React, {useState} from "react";
import BookTableOfContents from "./BookTableOfContents.jsx";
import BookSynposis from "./BookSynposis.jsx";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {useLibrary} from "../../Context/LibraryContext.jsx";
import SignupModal from "./SignupModal.jsx";
import LoginModal from "./LoginModal.jsx";
import BookReview from "./BookReview.jsx";

function BookContent({book}) {

    const {sessionData} = useAuth();
    const {libraryData} = useLibrary();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const [toggleState, setToggleState] = useState(1);

    // Check if the current book is in the user's library by matching bookid
    const isInLibrary = sessionData && libraryData?.some(item => item.bookid === book.id);

    return (
        <section className="book-main-information">
            <div className="book-main-info-container">
                <div className="book-info-section">
                    <button
                        className={toggleState === 1 ? "book-info-tab active-tab" : "book-info-tab"}
                        onClick={() => setToggleState(1)}
                    >
                        About
                    </button>

                    <div className="book-info-divider">|</div>
                    <button
                        className={toggleState === 2 ? "book-info-tab active-tab" : "book-info-tab"}
                        onClick={() => {
                            if (!sessionData) {
                                setShowLoginModal(true);
                            } else {
                                setToggleState(2);
                            }
                        }}
                    >
                        Table of Contents
                    </button>
                </div>

                <div className="book-info-section-tab">
                    {toggleState === 1 && (
                        <div className="book-info-tab-content active-content">
                            <BookSynposis description={book.description}/>
                            <BookReview bookId={book.id}/>
                        </div>
                    )}
                    {toggleState === 2 && (
                        sessionData ? (
                            isInLibrary ? (
                                <BookTableOfContents chapters={book.chapters} bookId={book.id} />
                            ) : (
                                <div style={{marginTop: 20, color: "red"}}>
                                    You need to purchase this book to read the table of contents.
                                </div>
                            )
                        ) : (
                            <div style={{marginTop: 20, color: "red"}}>
                                Please log in to view the table of contents.
                            </div>
                        )
                    )}
                </div>

                {showLoginModal && (
                    <LoginModal
                        onClose={() => setShowLoginModal(false)}
                        onOpen={() => setShowSignupModal(true)}
                    />
                )}

                {showSignupModal && (
                    <SignupModal
                        onClose={() => setShowSignupModal(false)}
                        onOpen={() => setShowLoginModal(true)}
                    />
                )}
            </div>
        </section>
    )
}

export default BookContent;