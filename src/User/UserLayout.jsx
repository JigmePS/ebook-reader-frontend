import {Outlet} from "react-router-dom";
import NavigationBar from "./Components/JSX/NavigationBar.jsx";
import Footer from "./Components/JSX/Footer.jsx";

function UserLayout() {
    return (
        <>
            <NavigationBar/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

export default UserLayout