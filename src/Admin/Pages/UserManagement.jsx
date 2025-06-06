import UserTable from "../Components/JSX/UserTable.jsx";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function UserManagement() {
    const { theme } = useTheme();

    return (
        <>
            <UserTable title={"User List"} theme={theme}/>
        </>
    )
}

export default UserManagement