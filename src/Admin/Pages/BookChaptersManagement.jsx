import BookChaptersTable from "../Components/JSX/BookChaptersTable.jsx";
import {useLocation} from "react-router-dom";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function BookChaptersManagement() {

    const { theme } = useTheme();

    const location = useLocation();
    const bookTitle = location.state?.booktitle;

    return (
        <>
            <BookChaptersTable title={bookTitle} theme={theme}/>
        </>
    )
}

export default BookChaptersManagement