import React from "react";
import "../CSS/OrderModal.css";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons"; // optional, for custom styling

function ViewOrderModal({ order, onClose }) {
    if (!order) return null;

    const total = order.items?.reduce((sum, item) => sum + item.price, 0) ?? 0;

    return (
        <div className="receipt-modal-container">
            <div className="receipt-modal">
                <div className="receipt-modal-close-btn-container">
                    <button
                        className="receipt-modal-close-btn"
                        type="button" onClick={onClose}>
                        <HugeiconsIcon icon={Cancel01Icon} size="1.7rem"/>
                    </button>
                </div>
                <div className="receipt-header-container">

                    <div className="receipt-header">
                        Order Receipt
                    </div>
                </div>

                <div className="receipt-body">
                    <p><strong>Client:</strong> {order.username}</p>
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>

                    <div className="receipt-items">
                        <h4>Items:</h4>
                        <table>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.bookTitle || "Unknown"}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="receipt-total">
                        <strong>Total:</strong> ${total.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewOrderModal;