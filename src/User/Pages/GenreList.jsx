import React, {useEffect, useState} from "react";
import BookListHeader from "../Components/JSX/BookListHeader.jsx";
import {Link} from "react-router-dom";
import "../Components/CSS/Genres.css";

function GenreList() {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/user/genres")
            .then(res => res.json())
            .then(data => setGenres(data));
    }, []);

    const sortedGenres = [...genres].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const groupedGenres = sortedGenres.reduce((acc, genre) => {
        const letter = genre.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(genre);
        return acc;
    }, {});

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <>
            <BookListHeader title={"Genre List"}/>
            <div className="genrelist-main-content-background">
                <div className="genre-scroll-container">
                    <div className="genre-alphabet-scroll">
                        {alphabet.map(letter => (
                            <a key={letter} href={`#${letter}`} className="letter-link">
                                {letter}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="genrelist-main-content">

                    <div className="genre-list-container">
                        {alphabet.map(letter => (
                            <div key={letter} id={letter} className="genre-letter-section">
                                {groupedGenres[letter] && (
                                    <>
                                        <h2 className="genre-letter">{letter}</h2>
                                        <div className="genre-columns">
                                            {groupedGenres[letter].map(genre => (
                                                <Link
                                                    to={`/genre/${genre.id}-${genre.name.replaceAll(" ", "-").toLowerCase()}`}
                                                    key={genre.id}
                                                    className={"genre-item"}
                                                >
                                                    {genre.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GenreList;