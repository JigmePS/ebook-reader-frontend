import "../Background.css"
import UserProfile from "../Components/JSX/UserProfile.jsx";
import UserReview from "../Components/JSX/UserReview.jsx";

function Profile() {
    return (
        <>
            <div className="user-profile-background">
                <div className="user-profile-container">
                    <UserProfile/>
                </div>
            </div>
            <div className="user-profile-reviews-background">
                <div className="user-profile-reviews-container">
                    <UserReview/>
                </div>
            </div>
        </>
    )
}

export default Profile;