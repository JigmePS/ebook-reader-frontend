import {Link} from "react-router-dom";
import logo from "../../../assets/logo.png";
import React from "react";
import '../CSS/ReaderBarFooter.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {LibraryIcon} from "@hugeicons/core-free-icons";
import {useReader} from "../../Context/ReaderContext.jsx";

function ReaderBar({chapter}) {

    const {isSticky} = useReader();

    return (
        <header className={`reader-bar ${isSticky ? "sticky" : ""}`}>
            <div className={"reader-bar-content"}>
                <div className={"reader-bar-left"}>
                    <div className="reader-logo">
                        <Link to="/" className={"reader-logo-link"}>
                            <img src={logo} alt="logo"/>
                        </Link>
                    </div>
                    <div className={"reader-bar-title-container"}>
                        <div className={"reader-bar-title"}>
                            <span className="reader-bar-title-text">
                                <Link
                                    to={`/book/${chapter.bookId}-${chapter.bookTitle.replaceAll(" ", "-").toLowerCase()}`}
                                    className={"reader-bar-book-title-link"}
                                >
                                    {chapter.bookTitle}
                                </Link>
                                <span className={"reader-bar-title-divider"}> / </span>
                                <span className={"reader-bar-chapter-title"}>Chapter {chapter.number}: </span>
                                <span className={"reader-bar-chapter-title"}>{chapter.name}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={"reader-bar-right"}>
                    <div className={"reader-bar-shortcut"}>
                        <div className={"reader-bar-shortcut-icon"}>
                            <Link
                                to="/library"
                                className={"reader-bar-library"}>
                                <HugeiconsIcon icon={LibraryIcon} size="1.9rem"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ReaderBar;