import BookListHeader from "../Components/JSX/BookListHeader.jsx";
import SearchResults from "../Components/JSX/SearchResults.jsx";
import {useLibrary} from "../Context/LibraryContext.jsx";
import LibraryItem from "../Components/JSX/LibraryItem.jsx";

function Library() {

    return (
        <>
            <BookListHeader title={"Your Library"}/>
            <div className="booklist-main-content-background">
                <div className="booklist-main-content">
                    <LibraryItem/>
                </div>
            </div>
        </>
    )
}

export default Library;