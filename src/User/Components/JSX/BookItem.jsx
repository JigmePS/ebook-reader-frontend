import '../CSS/Category.css'
import react, {useState} from 'react';
import {Link} from "react-router-dom";
import {HugeiconsIcon} from "@hugeicons/react";
import {Book01Icon, ShoppingBagAddIcon, ShoppingBagCheckIcon} from "@hugeicons/core-free-icons";
import React from "react";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import axios from "axios";
import {useCart} from "../../Context/CartContext.jsx";
import {toast} from "react-toastify";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";
import {useLibrary} from "../../Context/LibraryContext.jsx";

const BookItem = ({data}) => {

    const {id, title, author, price, coverImage} = data;

    const {sessionData} = useAuth();
    const {cartData, fetchCartData} = useCart();
    const {libraryData} = useLibrary();

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/user/cart/add",
                {bookId: id},
                {withCredentials: true}
            );
            fetchCartData();
            toast.success(response.data); // Show message
        } catch (err) {
            toast.error("Failed to add to cart");
        }
    };

    const isInLibrary = libraryData?.some(item => item.bookid === id);
    const isInCart = cartData?.some(item => item.book.bookid === id);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    return (
        <div className="category-item">
            <Link to={`/book/${id}-${title.replaceAll(" ", "-").toLowerCase()}`}
                  className="category-image">
                <img
                    src={`data:image/jpeg;base64,${coverImage}`}
                    alt={title}
                />
            </Link>
            <div className="category-item-data">
                <div className="category-item-info">
                    <Link to={`/book/${id}-${title.replaceAll(" ", "-").toLowerCase()}`}
                          className="item-title">
                        {title}
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
                            <button
                                className="category-item-action-btn category-item-add-btn"
                                onClick={handleAddToCart}
                            >
                                <HugeiconsIcon icon={ShoppingBagAddIcon} />
                                Add to Basket
                            </button>
                        )
                    ) : (
                        <button
                            className="category-item-action-btn category-item-add-btn"
                            onClick={() => setShowLoginModal(true)}
                        >
                            <HugeiconsIcon icon={ShoppingBagAddIcon} />
                            Add to Basket
                        </button>
                    )}
                </div>
            </div>
            {
                showLoginModal && (
                    <LoginModal
                        onClose={() => setShowLoginModal(false)}
                        onOpen={() => setShowSignupModal(true)}
                    />
                )
            }

            {
                showSignupModal && (
                    <SignupModal
                        onClose={() => setShowSignupModal(false)}
                        onOpen={() => setShowLoginModal(true)}
                    />
                )
            }
        </div>
    )
}

export default BookItem;