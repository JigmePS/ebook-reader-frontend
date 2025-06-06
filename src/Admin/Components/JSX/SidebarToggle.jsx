import {HugeiconsIcon} from "@hugeicons/react";
import {Menu02Icon} from "@hugeicons/core-free-icons";

import {useContext} from "react";
import {SidebarContext} from "../../Context/SidebarContext.jsx";

import "../CSS/Sidebar.css";

function SidebarToggle() {

    const {toggleSidebar} = useContext(SidebarContext)

    return (
        <>
            <div className="sidebar-toggle">
                <button
                    className="sidebar-toggle-button"
                    onClick={ () => toggleSidebar()}>
                    <HugeiconsIcon icon={Menu02Icon} size="2rem"/>
                </button>
            </div>
        </>
    )
}

export default SidebarToggle;