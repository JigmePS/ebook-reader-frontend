import React, {useState, useEffect, useRef} from "react";
import "../CSS/NavigationBar.css";
import "../CSS/Search.css"
import logo from "../../../assets/logo.png";
import {Link, useNavigate} from "react-router-dom";
import {HugeiconsIcon} from "@hugeicons/react";
import {
    Cancel01Icon,
    LibraryIcon, Logout03Icon, Moon02Icon,
    Search01Icon,
    ShoppingBag03Icon, Sun01Icon,
    User03Icon, UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import LoginModal from "../JSX/LoginModal.jsx";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {useCart} from "../../Context/CartContext.jsx"
import CartItem from "./CartItem.jsx";
import SignupModal from "./SignupModal.jsx";
import {usePicture} from "../../Context/PictureContext.jsx";
import {useTheme} from "../../../Shared/Context/ThemeContext.jsx"
import Switch from "react-switch";

function NavigationBar() {

    const { picture } = usePicture();

    const {sessionData, refreshSession} = useAuth();
    const {cartData} = useCart();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            fetch(`http://localhost:8080/user/search/suggestions?keyword=${searchQuery}`)
                .then(async res => {
                    const text = await res.text();
                    if (!text) {
                        setSearchSuggestions([]);
                        return;
                    }
                    try {
                        const data = JSON.parse(text);
                        console.log(data);
                        setSearchSuggestions(data);
                    } catch (err) {
                        console.error("Invalid JSON response:", err);
                        setSearchSuggestions([]);
                    }
                })
                .catch(err => console.error("Fetch failed:", err));
        } else {
            setSearchSuggestions([]);
        }
    }, [searchQuery]);

    const suggestionRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (!suggestionRef.current?.contains(e.target)) {
                setSearchSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const [openUserDropdown, setOpenUserDropdown] = useState(false);

    let userMenuRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            // Use setTimeout to delay check
            setTimeout(() => {
                if (!userMenuRef.current?.contains(e.target)) {
                    setOpenUserDropdown(false);
                }
            }, 0);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    let cartMenuRef = useRef();

    const [openCartDropdown, setOpenCartDropdown] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            setTimeout(() => {
                if (!cartMenuRef.current?.contains(e.target)) {
                    setOpenCartDropdown(false);
                }
            }, 0);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const totalPrice = cartData.reduce((sum, item) => sum + item.book.price, 0);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        fetch("http://localhost:8080/user/logout", {
            method: "POST",
            credentials: "include" // Include cookies in the request
        }).then(() => {
            refreshSession();
            // After logout, redirect the user
            navigate("/") // Redirect to homepage
        });
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar">
            <div className="header-content">
                <div className="logo">
                    <Link to="/" className={"logo-link"}>
                        <img src={logo} alt="logo"/>
                        <span className="logo-title">Biblio</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className={`search-container ${isSearchVisible ? "active" : ""}`}>
                    <form className="search-bar" onSubmit={(e) => {
                        e.preventDefault();
                        navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
                    }}>
                        <HugeiconsIcon icon={Search01Icon} size="1.9rem"/>
                        <input
                            className="search"
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <HugeiconsIcon
                            icon={Cancel01Icon}
                            size="1.9rem"
                            className="uil uil-times close-search"
                            onClick={() => setIsSearchVisible(false)}
                        />

                        {searchSuggestions.length > 0 && (
                            <ul ref={suggestionRef} className="search-suggestions">
                                {searchSuggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => navigate(`/book/${item.id}-${item.title.replaceAll(" ", "-").toLowerCase()}`)}>
                                        <img
                                            src={`data:image/jpeg;base64,${item.coverImage}`}
                                            alt="cover"
                                            className="suggestion-cover"
                                        />
                                        <div className="suggestion-info">
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: item.title.replace(new RegExp(searchQuery, 'gi'), match => `<mark>${match}</mark>`)
                                                }}
                                            />
                                            <small
                                                dangerouslySetInnerHTML={{
                                                    __html: item.author.replace(new RegExp(searchQuery, 'gi'), match => `<mark>${match}</mark>`)
                                                }}
                                            />
                                            <small
                                                dangerouslySetInnerHTML={{
                                                    __html: item.genres
                                                        .map(g => {
                                                            const highlighted = g.name.replace(new RegExp(searchQuery, 'gi'), match => `<mark>${match}</mark>`);
                                                            return highlighted;
                                                        })
                                                        .join(", ")
                                                }}
                                            />
                                            <small>${item.price}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>

                </div>

                {/*Shortcut Icons */}
                <div className="shortcut">
                    <div className="shortcut-icon">
                        <HugeiconsIcon
                            icon={Search01Icon}
                            size="1.9rem"
                            className="uil uil-search"
                            id="search-icon"
                            onClick={() => setIsSearchVisible(true)}
                        />
                    </div>

                    <div className="shortcut-icon" ref={cartMenuRef}>
                        <div className="user-optn">
                            {sessionData ? (
                                <>
                                    <button onClick={() => setOpenCartDropdown(!openCartDropdown)}
                                            className="cart-btn">
                                        <HugeiconsIcon icon={ShoppingBag03Icon} size="1.9rem"/>
                                        <div className="cart-count">{cartData.length}</div>
                                    </button>
                                    <div className={`cart-dropdown ${openCartDropdown ? "active" : "inactive"}`}>
                                        <ul className="cart-list">
                                            {cartData.length > 0 ? (
                                                cartData.map((item, index) => (
                                                    <CartItem key={index} item={item}/>
                                                ))
                                            ) : (
                                                <li className="empty-cart">Your cart is empty.</li>
                                            )}
                                        </ul>
                                        {cartData.length > 0 && (
                                            <div className="cart-total">
                                                <span className="cart-total-title">Total</span>
                                                <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="cart-checkout-container">
                                            {cartData.length > 0 ? (
                                                <Link to="/checkout" className={"cart-link"}>Checkout</Link>
                                            ) : (
                                                <div className="empty-cart-link">Checkout</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => setShowLoginModal(true)} className="cart-btn">
                                    <HugeiconsIcon icon={ShoppingBag03Icon} size="1.9rem"/>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="shortcut-icon">
                        <div className="user-optn">
                            {sessionData ? (
                                <Link to="/library" className="library-link">
                                    <HugeiconsIcon icon={LibraryIcon} size="1.9rem"/>
                                </Link>
                            ) : (
                                <button onClick={() => setShowLoginModal(true)} className="library-link">
                                    <HugeiconsIcon icon={LibraryIcon} size="1.9rem"/>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="shortcut-icon" ref={userMenuRef}>
                        {sessionData ? (
                            <>
                                <div className="user-optn" onClick={() => setOpenUserDropdown(!openUserDropdown)}>
                                    {picture ? (
                                        <img src={picture} className="user-picture" alt="user-icon" />
                                    ) : (
                                        <div className="user-fallback">
                                            {sessionData?.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className={`user-dropdown ${openUserDropdown ? "active" : "inactive"}`}>
                                    <ul>
                                        <DropdownItem icon={User03Icon} text="My Profile" link="/profile"/>
                                        <li className="dropdown-item">
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <HugeiconsIcon icon={theme === "dark" ? Moon02Icon : Sun01Icon} />
                                                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                                                <Switch
                                                    onChange={toggleTheme}
                                                    checked={theme === "dark"}
                                                    offColor="#bbb"
                                                    onColor="#222"
                                                    checkedIcon={false}
                                                    uncheckedIcon={false}
                                                    height={20}
                                                    width={35}
                                                />
                                            </div>
                                        </li>
                                        <li className="dropdown-item last-item">
                                            <button onClick={() => setShowLogoutModal(true)} className="logout-optn">
                                                <HugeiconsIcon
                                                    className="user-optn-icon"
                                                    icon={Logout03Icon}/>
                                                Log Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="user-optn">
                                <button onClick={() => setShowLoginModal(true)} className="login-optn">
                                    <HugeiconsIcon icon={UserRemove01Icon} size="1.9rem"/>
                                </button>
                            </div>
                        )}


                    </div>

                    {showLoginModal && (
                        <LoginModal
                            onClose={() => setShowLoginModal(false)}
                            onOpen={() => setShowSignupModal(true)}
                        />
                    )}

                    {showSignupModal && (
                        <SignupModal
                            onClose={() => setShowSignupModal(false)}
                            onOpen={() => setShowLoginModal(true)}
                        />
                    )}

                    {showLogoutModal && (
                        <ConfirmationModal
                            message={"You will be logged out of your account."}
                            action={"Log Out"}
                            onClose={() => setShowLogoutModal(false)}
                            onConfirm={() => {
                                logout();
                                setShowLogoutModal(false);
                            }}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}

function DropdownItem(props) {
    return (
        <li className="dropdown-item">
            <Link className={"user-optn-link"} to={props.link}>
                <HugeiconsIcon icon={props.icon} className="user-optn-icon"/>{props.text}
            </Link>
        </li>
    );
}

export default NavigationBar;
