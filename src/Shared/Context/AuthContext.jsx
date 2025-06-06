import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(null);

    const refreshSession = () => {
        fetch("http://localhost:8080/user/session", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => {
                setSessionData(data);  // This should include the updated user data, including the picture
            })
            .catch(() => setSessionData(null));
    };

    useEffect(() => {
        refreshSession();
    }, []); // This ensures the session is loaded once when the component mounts.

    return (
        <AuthContext.Provider value={{ sessionData, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
