import React, {useEffect, useState} from 'react'
import {Fade} from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'
import '../CSS/SlideShow.css'

import axios from "axios";
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowLeft01Icon, ArrowRight01Icon, Share05Icon} from "@hugeicons/core-free-icons";
import {Link} from "react-router-dom";

function SlideShow() {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/user/home/most-sold-books')
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error("Error fetching most sold books:", error);
            });
    }, []);

    const customPrevArrow = (
        <HugeiconsIcon className={"custom-arrow"} icon={ArrowLeft01Icon} size="2.5rem"/>
    );

    const customNextArrow = (
        <HugeiconsIcon className={"custom-arrow"} icon={ArrowRight01Icon} size="2.5rem"/>
    );

    return (
        <section className="slideshow">
            <div className="slide-container">
                <Fade
                    className="slide"
                    indicators={true}
                    prevArrow={customPrevArrow}
                    nextArrow={customNextArrow}
                    duration={4000}
                    transitionDuration={800}
                    pauseOnHover={true}
                >
                    {books.map((book, index) => (
                        <div className="slide-content" key={index}>
                            <div className="slide-cover">
                                <Link to={`/book/${book.id}-${book.title.replaceAll(" ", "-").toLowerCase()}`}>
                                    <img
                                        src={`data:image/jpeg;base64,${book.coverImage}`}
                                        alt={book.title}
                                    />
                                </Link>
                            </div>
                            <div className="slide-info">
                                <div className="slide-data">
                                    <div className="slide-title">
                                        <Link className={"slide-title-link"} to={`/book/${book.id}-${book.title.replaceAll(" ", "-").toLowerCase()}`}>
                                            {book.title}
                                        </Link>
                                    </div>
                                    <div className="slide-description">
                                        {book.description}
                                    </div>
                                </div>
                                <div className="slide-action">
                                    <Link className={"slide-link"} to={`/book/${book.id}-${book.title.replaceAll(" ", "-").toLowerCase()}`}>
                                        Explore now
                                        <HugeiconsIcon icon={Share05Icon} size="1.5rem"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </Fade>
            </div>
        </section>
    )
}

export default SlideShow