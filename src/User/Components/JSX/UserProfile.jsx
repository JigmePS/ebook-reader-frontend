import "../CSS/Profile.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {Edit03Icon, Settings03Icon} from "@hugeicons/core-free-icons";
import {usePicture} from "../../Context/PictureContext.jsx";

function UserProfile() {
    const {fetchUserPicture} = usePicture();

    const [user, setUser] = useState(null);
    const fileInputRef = useRef(null);  // Define ref here, unconditionally

    useEffect(() => {
        // Fetch user profile data from backend
        fetch("http://localhost:8080/user/profile", {
            method: "GET",
            credentials: "include", // This sends the session cookie
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err) => console.error("Failed to load profile", err));
    }, []);

    if (!user) return <div>Loading...</div>;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        const formData = new FormData();
        formData.append("file", file);

        // Modify the fetch URL to use the userId from the session
        fetch(`http://localhost:8080/user/upload-picture`, {
            method: "POST",
            credentials: "include", // Include session credentials
            body: formData,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Upload failed");
                return res.json(); // Assuming the backend returns the updated user object
            })
            .then((updatedUser) => {
                // Update the user state with the new picture
                setUser((prev) => ({
                    ...prev,
                    picture: updatedUser.picture, // Update the picture in the user state
                }));

                // Optionally, refresh the session data to update the session with the new picture
                fetchUserPicture();
            })
            .catch((err) => {
                console.error("Upload failed", err);
                alert("Failed to upload picture.");
            });
    };

    const bookCount = user.userLibrary.length;
    const reviewCount = user.reviews.length;

    return (
        <div className="user-profile-content">
            <div className="user-profile-image-container">
                <button
                    className="user-profile-image-edit-btn"
                    onClick={() => fileInputRef.current.click()}  // Trigger file input on click
                >
                    <HugeiconsIcon icon={Edit03Icon} size="1.5rem" />
                </button>
                {user.picture ? (
                    <img
                        className="user-profile-image"
                        src={`data:image/jpeg;base64,${user.picture}`}
                        alt="User Profile"
                    />
                ) : (
                    <div className="user-profile-image-fallback">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}
                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}  // Handle file change here
                />
            </div>

            <div className="user-profile-info">
                <div className="user-profile-activities">
                    <div className="user-profile-activity">
                        <div className="user-profile-activity-value">{bookCount}</div>
                        <div className="user-profile-activity-name">
                            {bookCount === 1 ? "Book" : "Books"}
                        </div>
                    </div>
                    <div className="user-profile-activity-divider">|</div>
                    <div className="user-profile-activity">
                        <div className="user-profile-activity-value">{reviewCount}</div>
                        <div className="user-profile-activity-name">
                            {reviewCount === 1 ? "Review" : "Reviews"}
                        </div>
                    </div>
                </div>

                <div className="user-profile-data-container">
                    <div className="user-profile-data-content">
                        <div className="user-profile-data-name">{user.username}</div>
                        <div className="user-profile-data-date">Joined: {user.createdate}</div>
                    </div>
                    <div className="user-profile-data-action">
                        <Link to="/profile/settings" className={"user-profile-edit-btn"}>
                            <HugeiconsIcon icon={Settings03Icon} size="1.5rem" />
                            <span className="user-profile-settings-link">User Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
