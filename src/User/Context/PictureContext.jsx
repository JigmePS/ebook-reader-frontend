import React, { createContext, useContext, useEffect, useState } from "react";

const PictureContext = createContext();

export const PictureProvider = ({ children }) => {
    const [picture, setPicture] = useState(null);

    const fetchUserPicture = () => {
        fetch("http://localhost:8080/user/picture", {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("No picture found");
                return res.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPicture(reader.result); // This will be a data URL
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.error("Error fetching picture:", err);
                setPicture(null);
            });
    };

    useEffect(() => {
        fetchUserPicture(); // Fetch once on mount
    }, []);

    return (
        <PictureContext.Provider value={{ picture, fetchUserPicture }}>
            {children}
        </PictureContext.Provider>
    );
};

export const usePicture = () => useContext(PictureContext);
