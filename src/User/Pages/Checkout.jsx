import "../Background.css"
import "../Components/CSS/Checkout.css"
import {useCart} from "../Context/CartContext.jsx";

function Checkout() {

    const {cartData} = useCart()

    // Calculate subtotal
    const subtotal = cartData.reduce((sum, item) => sum + item.book.price, 0);

    // Calculate tax as 13% of subtotal
    const tax = 0 //subtotal * 0.13;

    // Total = subtotal + tax
    const total = subtotal + tax;

    const handleCheckout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/payment/create-checkout-session", {
                method: "POST",
                credentials: "include", // important for session-based login
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Failed to create Stripe session");
            }

            const data = await response.json();
            const sessionUrl = data.url;

            if (sessionUrl) {
                window.location.href = sessionUrl; // Redirect to Stripe Checkout
            } else {
                throw new Error("Stripe session URL missing");
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <>
            <div className="checkout-background">
                <div className="checkout-container">
                    <div className="checkout-content">
                        <div className="checkout-info">
                            <div className="checkout-info-title">Your Order</div>

                            {cartData.length > 0 ? (
                                cartData.map((item, index) => (
                                    <div className="checkout-info-item" key={index}>
                                        <div className="checkout-info-item-image-container">
                                            <img
                                                className="checkout-info-item-image"
                                                src={`data:image/jpeg;base64,${item.book.coverImage}`}
                                                alt="Cover"
                                            />
                                        </div>
                                        <div className="checkout-info-item-details">
                                            <div className="checkout-info-item-title">
                                                {item.book.booktitle}
                                            </div>
                                            <div className="checkout-info-item-author">
                                                by {item.book.author}
                                            </div>
                                            <div className="checkout-info-item-price">
                                                ${item.book.price.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No items in cart.</div>
                            )}

                            <div className="checkout-info-subtotal">
                                <div className="checkout-info-subtotal-title">Subtotal</div>
                                <div className="checkout-info-subtotal-price">
                                    ${subtotal.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="checkout-summary">
                            <div className="checkout-summary-title">Order Summary</div>
                            <div className="checkout-summary-total">
                                <div className="checkout-summary-total-container">
                                    <div className="checkout-price-title">
                                        Subtotal ({cartData.length} items)
                                    </div>
                                    <div className="checkout-price-value">${subtotal.toFixed(2)}</div>
                                </div>
                                <div className="checkout-summary-total-container">
                                    <div className="checkout-price-title">Tax (0%)</div>
                                    <div className="checkout-price-value">${tax.toFixed(2)}</div>
                                </div>
                                <div className="checkout-summary-total-container checkout-summary-total-container-last">
                                    <div className="checkout-price-title checkout-price-title-last">Total</div>
                                    <div className="checkout-price-value checkout-price-value-last">
                                        ${total.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="checkout-complete-container">
                                <button className="checkout-complete-btn" onClick={handleCheckout}>
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout;