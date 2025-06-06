import "../CSS/Profile.css"
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {useState} from "react";
import EditUsernameModal from "./EditUsernameModal.jsx";
import EditEmailModal from "./EditEmailModal.jsx";
import EditPasswordModal from "./EditPasswordModal.jsx";
import {Link} from "react-router-dom";
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowRight01Icon, Edit03Icon} from "@hugeicons/core-free-icons";

function UserSettings() {
    const {sessionData} = useAuth();

    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <>
            <div className="profile-settings-content">
                <div className="profile-settings-content-title">
                    Username
                    <button
                        className="profile-settings-edit-btn"
                        onClick={() => setShowUsernameModal(true)}>
                        <HugeiconsIcon icon={Edit03Icon} size="1rem"/>
                    </button>
                </div>
                <div className="profile-settings-content-value">
                    {sessionData?.username || "N/A"}
                </div>
            </div>
            <div className="profile-settings-content">
                <div className="profile-settings-content-title">
                    Email
                    <button
                        className="profile-settings-edit-btn"
                        onClick={() => setShowEmailModal(true)}>
                        <HugeiconsIcon icon={Edit03Icon} size="1rem"/>
                    </button>
                </div>
                <div className="profile-settings-content-value">
                    {sessionData?.email || "N/A"}
                </div>
            </div>
            <div className="profile-settings-content">
                <div className="profile-settings-content-title">
                    Password
                    <button
                        className="profile-settings-edit-btn"
                        onClick={() => setShowPasswordModal(true)}>
                        <HugeiconsIcon icon={Edit03Icon} size="1rem"/>
                    </button>
                </div>
                <div className="profile-settings-content-value">
                    *******
                </div>
            </div>
            <Link
                to="/profile/settings/order-history"
                className={"profile-settings-order-history"}>
                <div className="profile-settings-content-title">
                    Order History
                    <HugeiconsIcon icon={ArrowRight01Icon}/>
                </div>
            </Link>

            {showUsernameModal && (
                <EditUsernameModal
                    currentUsername={sessionData?.username}
                    onClose={() => setShowUsernameModal(false)}
                />
            )}

            {showEmailModal && (
                <EditEmailModal
                    currentEmail={sessionData?.email}
                    onClose={() => setShowEmailModal(false)}
                />
            )}

            {showPasswordModal && (
                <EditPasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </>
    )
}

export default UserSettings;