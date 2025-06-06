import UserSettings from "../Components/JSX/UserSettings.jsx";

function ProfileSettings() {
    return (
        <>
            <div className="profile-settings-title-background">
                <div className="profile-settings-title">
                    User Settings
                </div>
            </div>
            <div className="profile-settings-content-background">
                <div className="profile-settings-content-container">
                    <UserSettings/>
                </div>
            </div>
        </>
    )
}

export default ProfileSettings;