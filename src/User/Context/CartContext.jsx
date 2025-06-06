import React, {createContext, useContext, useEffect, useState} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState([]);

    // Fetch cart data from backend based on session
    const fetchCartData = async () => {
        try {
            const response = await fetch("http://localhost:8080/user/cart", {
                credentials: "include",
            });
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCartData(data);
            } else {
                console.warn("Failed to fetch cart data");
                setCartData([]);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            setCartData([]);
        }
    };

    useEffect(() => {
        fetchCartData(); // fetch once when the app loads
    }, []);

    return (
        <CartContext.Provider value={{ cartData, fetchCartData }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);