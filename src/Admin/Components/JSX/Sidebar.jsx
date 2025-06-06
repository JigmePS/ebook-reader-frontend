import "../CSS/Sidebar.css"
import {Link} from "react-router-dom";
import {HugeiconsIcon} from "@hugeicons/react";
import React, {useContext, useEffect, useState} from "react";
import {
    Books01Icon,
    DashboardSquare01Icon,
    Invoice01Icon, Logout03Icon,
    MoonEclipseIcon,
    Tag01Icon,
    UserGroupIcon
} from "@hugeicons/core-free-icons";
import logo from "../../../assets/logo.png";
import {SidebarContext} from "../../Context/SidebarContext.jsx";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import {useTheme} from "../../../Shared/Context/ThemeContext.jsx";
import Switch from "react-switch";


function Sidebar() {

    const [activeLinkIdx] = useState(1);
    const [sidebarClass, setSidebarClass] = useState("");
    const {isSidebarOpen} = useContext(SidebarContext);

    useEffect(() => {
        if (isSidebarOpen) {
            setSidebarClass("admin-sidebar-change");
        } else {
            setSidebarClass("");
        }
    }, [isSidebarOpen]);

    const [showModal, setShowModal] = useState(false);

    const logout = () => {
        fetch("http://localhost:8080/user/logout", {
            method: "POST",
            credentials: "include" // Include cookies in the request
        }).then(() => {
            // After logout, redirect the user
            window.location.href = "/"; // Redirect to homepage or login page
        });
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <aside className={`admin-sidebar ${sidebarClass}`}>
            <div className="admin-sidebar-header">
                <div className="admin-sidebar-logo">
                    <img src={logo} alt="logo"/>
                </div>
                <div className="admin-sidebar-title">
                    Biblio
                </div>
            </div>
            <div className="admin-sidebar-optns">
                <div className="admin-sidebar-link-list">
                    <ul className="admin-sidebar-list">
                        <SidebarLink icon={DashboardSquare01Icon} text={"Dashboard"} to={"/admin-dashboard"}/>
                        <SidebarLink icon={UserGroupIcon} text={"Users"} to={"/user-management"}/>
                        <SidebarLink icon={Books01Icon} text={"Books"} to={"/book-management"}/>
                        <SidebarLink icon={Tag01Icon} text={"Genres"} to={"/genre-management"}/>
                        <SidebarLink icon={Invoice01Icon} text={"Orders"} to={"/order-list"}/>
                    </ul>
                </div>
                <div className="admin-sidebar-action-list">
                    <ul className={"admin-sidebar-list"}>
                        <li className="sidebar-item sidebar-dark-toggle">
                            <div className="theme-action">
                            <HugeiconsIcon
                                icon={MoonEclipseIcon}
                                className="theme-optn-icon"
                                size="1.7rem"
                            />
                            <span className="sidebar-link-text">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                            <Switch
                                onChange={toggleTheme}
                                checked={theme === "dark"}
                                offColor="#bbb"
                                onColor="#333"
                                uncheckedIcon={false}
                                checkedIcon={false}
                                height={20}
                                width={35}
                                handleDiameter={18}
                            />
                            </div>
                        </li>

                        <li className="sidebar-item">
                            <button onClick={() => setShowModal(true)} className="admin-bottom-action">
                                <HugeiconsIcon icon={Logout03Icon} className="admin-optn-icon" size="1.7rem"/>
                                <span className="sidebar-action-text">
                                    Logout
                                </span>
                            </button>
                        </li>
                    </ul>
                    {showModal && <ConfirmationModal
                        message={"You will be logged out of your account."}
                        action={"Log Out"}
                        onClose={() => setShowModal(false)}
                        onConfirm={() => {
                            // Call the logout function when the user confirms
                            logout();
                            setShowModal(false); // Close the modal after logout
                        }}
                    />}
                </div>
            </div>
        </aside>
    )

    function SidebarLink(props) {
        return (
            <li className="sidebar-item">
                <Link className={"sidebar-link"} to={props.to}>
                    <HugeiconsIcon icon={props.icon} className="admin-optn-icon" size="1.7rem"/>
                    <span className="sidebar-link-text">
                        {props.text}
                    </span>
                </Link>
            </li>
        );
    }
}

export default Sidebar;