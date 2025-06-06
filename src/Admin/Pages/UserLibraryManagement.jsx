import UserLibraryTable from "../Components/JSX/UserLibraryTable.jsx";
import {useLocation, useParams} from "react-router-dom";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function UserLibraryManagement() {

    const { theme } = useTheme();

    const location = useLocation();
    const username = location.state?.username;

    return (
        <>
            <UserLibraryTable title={username} theme={theme}/>
        </>
    )
}

export default UserLibraryManagement