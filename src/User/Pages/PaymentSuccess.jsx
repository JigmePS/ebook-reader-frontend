import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {useCart} from "../Context/CartContext.jsx";
import "../Background.css"
import "../Components/CSS/Checkout.css"
import {HugeiconsIcon} from "@hugeicons/react";
import {CheckmarkCircle03Icon} from "@hugeicons/core-free-icons";

function PaymentSuccessPage() {
    const {fetchCartData} = useCart();
    const [params] = useSearchParams();
    const [message, setMessage] = useState("Processing your order...");

    useEffect(() => {
        const sessionId = params.get("session_id");
        if (sessionId) {
            // Optionally ping backend to confirm session if needed
            fetch(`http://localhost:8080/api/payment/success?session_id=${sessionId}`, {
                method: "GET",
                credentials: "include",
            })
                .then((res) => res.text())
                .then((text) => {
                    setMessage("Your payment was successful.");
                    fetchCartData();
                    console.log("Success confirmation:", text);
                })
                .catch((err) => {
                    console.error("Optional confirmation failed:", err);
                    setMessage("Payment complete! If your items aren’t available, please contact support.");
                });
        } else {
            setMessage("No session ID found. If you completed a payment, check your library.");
        }
    }, []);

    return (
        <div className="checkout-background">
            <div className="checkout-message-container">
                <div className="payment-message-container">
                    <div className="payment-success-icon-container">
                        <HugeiconsIcon
                            className="payment-success-icon"
                            icon={CheckmarkCircle03Icon}
                            size="4rem"
                        />
                    </div>
                    <div className="payment-message">{message}</div>
                    <div className="payment-message-extra">Go to {" "}
                        <Link
                            className="payment-redirect"
                            to="/library">
                            Library
                        </Link>
                        {" "} OR {" "}
                        <Link
                            className="payment-redirect"
                            to="/">
                            Browse more books
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;