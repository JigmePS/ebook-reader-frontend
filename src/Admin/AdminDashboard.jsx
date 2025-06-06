import AdminHeader from "./Components/JSX/AdminHeader.jsx";

import "./Components/CSS/AdminLayout.css"
import AdminContentBrief from "./Components/JSX/AdminContentBrief.jsx";
import {Books01Icon, Dollar01Icon, StarIcon, UserGroupIcon} from "@hugeicons/core-free-icons";
import {useContext, useEffect, useState} from "react";
import {SidebarContext} from "./Context/SidebarContext.jsx";

function AdminDashboard() {

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

    const [stats, setStats] = useState({
        bookCount: 0,
        userCount: 0,
        reviewCount: 0,
        totalSales: 0
    });

    useEffect(() => {
        if (isSidebarOpen) {
            setSidebarClass("admin-content-container-change");
        } else {
            setSidebarClass("");
        }
    }, [isSidebarOpen]);

    useEffect(() => {
        fetch("http://localhost:8080/admin/stats", {
            method: "GET",
            credentials: "include" // ← This includes cookies or HTTP auth headers
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch stats");
                }
                console.log(res);
                return res.json();
            })
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching admin stats:", err));
    }, []);


    return (
        <>
            <div className="admin-header-container">
                <AdminHeader title="Home"/>
            </div>
            <div className={`admin-content-container ${sidebarClass}`}>
                <div className="admin-content-grid">
                    <AdminContentBrief
                        link="/book-management"
                        title="Total Books"
                        data={stats.bookCount}
                        icon={Books01Icon} iconColor="#2563eb" iconBG="#dbeafe"/>
                    <AdminContentBrief
                        link="/user-management"
                        title="Active Users"
                        data={stats.userCount}
                        icon={UserGroupIcon} iconColor="#2ba85a" iconBG="#dcfce7"/>
                    <AdminContentBrief
                        link="/order-list"
                        title="Total Sales"
                        data={`$${stats.totalSales}`}
                        icon={Dollar01Icon} iconColor="#b763eb" iconBG="#f3e8ff"/>
                    <AdminContentBrief
                        link="/book-management"
                        title="Total Reviews"
                        data={stats.reviewCount}
                        icon={StarIcon} iconColor="#ca8a04" iconBG="#fef9c3"/>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;