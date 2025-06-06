import {Outlet} from "react-router-dom";
import Sidebar from "./Components/JSX/Sidebar.jsx";
import "./Components/CSS/AdminLayout.css"
import SidebarToggle from "./Components/JSX/SidebarToggle.jsx";

function AdminLayout() {
    return (
        <div className="admin-layout">
            <Sidebar/>
            <main className="admin-main">
                <SidebarToggle/>
                <Outlet/>
            </main>
        </div>
    )
}

export default AdminLayout