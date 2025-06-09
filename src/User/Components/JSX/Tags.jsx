import '../CSS/Category.css'
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

function Tags() {

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/user/home/genres/random')
            .then(response => response.json())
            .then(data => setGenres(data))
            .catch(error => console.error('Error fetching genres:', error));
    }, []);

    console.log(genres);
    return (
        <section className="category-container">
            <div className="category">
                <div className="category-info">
                    <div className="category-title">Tags/Genres</div>
                    <div className="category-expand">
                        <Link
                            className={"category-expand-link"}
                            to="/genre">
                            See More
                        </Link>
                    </div>
                </div>
            </div>

            <div className="tag-container">
                <div className="tag-content">
                    {genres.map((genre) => (
                        <div key={genre.genreid} className="tag-info">
                            <Link
                                to={`/genre/${genre.genreid}-${genre.genrename.replaceAll(" ", "-").toLowerCase()}`}
                                className="tag-name">
                                {genre.genrename}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Tags;