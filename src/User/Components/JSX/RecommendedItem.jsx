import '../CSS/Category.css';
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {Book01Icon, ShoppingBagAddIcon, ShoppingBagCheckIcon} from "@hugeicons/core-free-icons";
import { useAuth } from "../../../Shared/Context/AuthContext.jsx";
import axios from "axios";
import { useCart } from "../../Context/CartContext.jsx";
import { toast } from "react-toastify";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import { useLibrary } from "../../Context/LibraryContext.jsx";

const RecommendedItem = ({ data }) => {
    // Destructure according to your actual data shape
    const { bookid, booktitle, author, price, coverImage } = data;
    const { sessionData } = useAuth();
    const { cartData, fetchCartData } = useCart();
    const { libraryData } = useLibrary();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    // Use bookid for checks
    const isInLibrary = libraryData?.some(item => item.bookid === bookid);
    const isInCart = cartData?.some(item => item.book?.bookid === bookid);

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/user/cart/add",
                { bookId: bookid },
                { withCredentials: true }
            );
            fetchCartData();
            toast.success(response.data);
        } catch (err) {
            console.error("Add to cart failed:", err.response?.data || err.message);
            toast.error("Failed to add to cart");
        }
    };

    // Prepare URL-friendly title
    const formattedTitle = booktitle ? booktitle.replaceAll(" ", "-").toLowerCase() : "untitled";
    const bookUrl = `/book/${bookid}-${formattedTitle}`;

    return (
        <div className="category-item">
            <Link to={bookUrl} className="category-image">
                <img
                    src={`data:image/jpeg;base64,${coverImage}`}
                    alt={booktitle || "Book cover"}
                />
            </Link>

            <div className="category-item-data">
                <div className="category-item-info">
                    <Link to={bookUrl} className="item-title">
                        {booktitle}
                    </Link>
                    <div className="item-price">${price}</div>
                </div>

                <div className="category-item-action">
                    {sessionData ? (
                        isInLibrary ? (
                            <button className="category-item-action-btn category-item-library-btn" disabled>
                                <HugeiconsIcon icon={Book01Icon} />
                                In the Library
                            </button>
                        ) : isInCart ? (
                            <button className="category-item-action-btn category-item-basket-btn" disabled>
                                <HugeiconsIcon icon={ShoppingBagCheckIcon} />
                                In the Basket
                            </button>
                        ) : (
                            <button className="category-item-action-btn category-item-add-btn" onClick={handleAddToCart}>
                                <HugeiconsIcon icon={ShoppingBagAddIcon} />
                                Add to Basket
                            </button>
                        )
                    ) : (
                        <button className="category-item-action-btn category-item-add-btn" onClick={() => setShowLoginModal(true)}>
                            <HugeiconsIcon icon={ShoppingBagAddIcon} />
                            Add to Basket
                        </button>
                    )}
                </div>
            </div>

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onOpen={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                    }}
                />
            )}

            {showSignupModal && (
                <SignupModal
                    onClose={() => setShowSignupModal(false)}
                    onOpen={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </div>
    );
};

export default RecommendedItem;
