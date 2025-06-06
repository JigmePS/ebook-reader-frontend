import {Outlet} from "react-router-dom";

import AdminHeader from "./Components/JSX/AdminHeader.jsx";

import "./Components/CSS/AdminLayout.css"
import {useContext, useEffect, useState} from "react";
import {SidebarContext} from "./Context/SidebarContext.jsx";

function OrderListLayout() {

    const [activeLinkIdx] = useState(1);
    const [sidebarClass, setSidebarClass] = useState("");
    const {isSidebarOpen} = useContext(SidebarContext);

    useEffect(() => {
        if (isSidebarOpen) {
            setSidebarClass("admin-content-container-change");
        } else {
            setSidebarClass("");
        }
    }, [isSidebarOpen]);

    return (
        <>
            <div className="admin-header-container">
                <AdminHeader title="Orders"/>
            </div>
            <div className={`admin-content-container ${sidebarClass}`}>
                <main>
                    <Outlet/>
                </main>
            </div>
        </>
    )
}

export default OrderListLayout;