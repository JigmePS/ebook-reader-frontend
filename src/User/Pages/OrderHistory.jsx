import OrderRecord from "../Components/JSX/OrderRecord.jsx";
import { useEffect, useState } from "react";
import ViewOrderModal from "../../Shared/Components/JSX/ViewOrderModal.jsx";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New state to track which order to view
    const [viewOrder, setViewOrder] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch("http://localhost:8080/user/orders", {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error loading orders: {error}</div>;
    }

    return (
        <>
            <div className="order-history-title-background">
                <div className="order-history-title">Order History</div>
            </div>
            <div className="order-history-content-background">
                <div className="order-history-content-container">
                    {orders.length === 0 ? (
                        <div>No orders found.</div>
                    ) : (
                        orders.map((order) => (
                            <OrderRecord
                                key={order.orderId}
                                id={order.orderId}
                                items={order.items.map((item) => item.bookTitle)}
                                totalAmount={Number(order.totalAmount)}
                                // Pass full order object so modal can show details
                                order={order}
                                onView={() => setViewOrder(order)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Show modal if an order is selected */}
            {viewOrder && (
                <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} />
            )}
        </>
    );
}

export default OrderHistory;
