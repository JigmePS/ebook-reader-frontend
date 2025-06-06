import UserReviewsTable from "../Components/JSX/UserReviewsTable.jsx";
import {useLocation, useParams} from "react-router-dom";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function UserReviewsManagement() {

    const { theme } = useTheme();

    const location = useLocation();
    const username = location.state?.username || "User";

    return (
        <>
            <UserReviewsTable title={`Reviews by ${username}`} theme={theme} />
        </>
    )
}

export default UserReviewsManagement