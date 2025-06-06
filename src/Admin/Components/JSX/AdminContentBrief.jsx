import '../CSS/AdminContentBrief.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {Link} from "react-router-dom";

function AdminContentBrief({link, title, data, icon, iconColor, iconBG}) {
    return (
        <Link to={link}>
            <div className="admin-content-brief-container">
                <div className="admin-content-brief-content">
                    <div className="admin-content-brief-info">
                        <div className="admin-content-brief-title">
                            {title}
                        </div>
                        <div className="admin-content-brief-data">
                            {data}
                        </div>
                    </div>
                    <div className="admin-content-brief-icon" style={{background: iconBG}}>
                        <HugeiconsIcon
                            icon={icon}
                            size="1.4rem"
                            color={iconColor}/>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default AdminContentBrief