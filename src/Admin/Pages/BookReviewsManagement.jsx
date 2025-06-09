import BookReviewsTable from "../Components/JSX/BookReviewsTable.jsx";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function BookReviewsManagement() {

    const { theme } = useTheme();

    return (
        <>
            <BookReviewsTable theme={theme}/>
        </>
    )
}

export default BookReviewsManagement