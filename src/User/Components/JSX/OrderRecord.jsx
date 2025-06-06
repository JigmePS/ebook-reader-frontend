import "../CSS/OrderHistory.css";
import {HugeiconsIcon} from "@hugeicons/react";
import {SquareArrowExpand01Icon} from "@hugeicons/core-free-icons";
import React from "react";

function OrderRecord({ id, items = [], totalAmount = 0, onView }) {
    return (
        <div className="order-history-record">
            <div className="order-history-record-id">#{id}</div>
            <div className="order-history-record-items">
                {items.length > 0 ? items.join(", ") : "No items"}
            </div>
            <div className="order-history-record-total-amount">
                ${totalAmount.toFixed(2)}
            </div>
            <div className="order-history-record-action">
                <button
                    className="order-record-view-btn"
                    onClick={onView}>
                    <HugeiconsIcon icon={SquareArrowExpand01Icon}/>
                </button>
            </div>
        </div>
    );
}

export default OrderRecord;
