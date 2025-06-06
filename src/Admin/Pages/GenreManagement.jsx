import GenreTable from "../Components/JSX/GenreTable.jsx";
import {useTheme} from "../../Shared/Context/ThemeContext.jsx";

function GenreManagement() {

    const { theme } = useTheme();

    return (
        <>
            <GenreTable title={"Genre List"} theme={theme}/>
        </>
    )
}

export default GenreManagement