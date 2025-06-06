// src/Context/ReviewContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserReviews = async () => {
        try {
            const response = await axios.get("http://localhost:8080/user/reviews", {
                withCredentials: true,
            });
            setUserReviews(response.data);
        } catch (err) {
            setError("Failed to fetch user reviews.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    console.log(userReviews);

    useEffect(() => {
        fetchUserReviews();
    }, []);

    return (
        <ReviewContext.Provider value={{ userReviews, fetchUserReviews, loading, error }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = () => useContext(ReviewContext);
