import SlideShow from "../Components/JSX/SlideShow.jsx";
import BookCategory from "../Components/JSX/BookCategory.jsx";
import Tags from "../Components/JSX/Tags.jsx";

import '../Background.css'
import {useAuth} from "../../Shared/Context/AuthContext.jsx";
import Recommendations from "../Components/JSX/Recommendations.jsx";

function Home() {

    const {sessionData} = useAuth();

    return (
        <>
            <div className="home-content-background">
                <div className="home-content">
                    <SlideShow/>
                    <div className="home-content-category">
                        {sessionData && (
                            <Recommendations/>
                        )}
                        <BookCategory title="Trending Books" apiUrl="/user/home/most-viewed-books"/>
                        <BookCategory title="Highest Rated Books" apiUrl="/user/home/highest-rated-books"/>
                        <BookCategory title="New Releases" apiUrl="/user/home/newest-books"/>
                        <Tags/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;

