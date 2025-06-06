import '../CSS/Footer.css'
import {Link, useNavigate} from "react-router-dom";
import logo from "../../../assets/logo.png"
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {useState} from "react";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";

function Footer() {

    const { sessionData } = useAuth();
    const navigate = useNavigate();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false); // ⬅️ Add signup modal state

    const handleProtectedNav = (path) => {
        if (sessionData) {
            navigate(path);
        } else {
            setShowLoginModal(true);
        }
    };

    const handleOpenSignup = () => {
        setShowSignupModal(true);
        setShowLoginModal(false);
    };

    const handleOpenLogin = () => {
        setShowLoginModal(true);
        setShowSignupModal(false);
    };

    return (
        <footer className="main-footer">
            <div className="main-footer-container">
                <div className="main-footer-left">
                    <div className="main-footer-content">
                        <div className="main-footer-content-title">
                            <div className="footer-logo-container">
                                <img
                                    className="footer-logo"
                                    src={logo}/>
                            </div>
                             Biblio
                        </div>
                        <div className="main-footer-content-description">
                            Your digital sanctuary for literature lovers. Discover, read, and share your favorite books.
                        </div>
                    </div>
                </div>
                <div className="main-footer-right">
                    <div className="main-footer-content">
                        <div className="main-footer-content-title">
                            About
                        </div>
                        <div className="main-footer-content-links">
                            <Link
                                className={"main-footer-content-link"}
                                to="/about">
                                About us
                            </Link>
                            <div className="contact-info">
                                Contact Info
                                {/*<div className="contact-info-details">Address: Some, place, here</div>*/}
                                <div className="contact-info-details">biblio_support@info.com</div>
                                <div className="contact-info-details">XXXXXXXX</div>
                            </div>

                        </div>
                    </div>

                    <div className="main-footer-content">
                        <div className="main-footer-content-title">
                            Explore
                        </div>
                        <div className="main-footer-content-links">
                            <Link
                                className={"main-footer-content-link"}
                                to="/trending-books">
                                Trending Books
                            </Link>
                            <Link
                                className={"main-footer-content-link"}
                                to="/highest-rated-books">
                                Highest Rated Books
                            </Link>
                            <Link
                                className={"main-footer-content-link"}
                                to="/new-releases">
                                New Releases
                            </Link>
                            <Link
                                className={"main-footer-content-link"}
                                to="/genre">
                                Genres
                            </Link>
                        </div>
                    </div>

                    <div className="main-footer-content">
                        <div className="main-footer-content-title">
                            Account
                        </div>
                        <div className="main-footer-content-links">
                            <button
                                className="main-footer-content-link"
                                onClick={() => handleProtectedNav("/library")}
                            >
                                Library
                            </button>
                            <button
                                className="main-footer-content-link"
                                onClick={() => handleProtectedNav("/profile")}
                            >
                                Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-footer-copyright">
                © 2025 Bibliotheca Limited
            </div>

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onOpen={handleOpenSignup}
                />
            )}

            {showSignupModal && (
                <SignupModal
                    onClose={() => setShowSignupModal(false)}
                    onOpen={handleOpenLogin}
                />
            )}

        </footer>
    )
}

export default Footer;