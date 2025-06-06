import BookTable from "../Components/JSX/BookTable.jsx";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function BookManagement() {

    const { theme } = useTheme();

    return (
        <>
            <BookTable title={"Book List"} theme={theme}/>
        </>
    )
}

export default BookManagement;