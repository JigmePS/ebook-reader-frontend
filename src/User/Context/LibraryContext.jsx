import React, { createContext, useContext, useEffect, useState } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
    const [libraryData, setLibraryData] = useState([]);

    const fetchLibraryData = async () => {
        try {
            const response = await fetch("http://localhost:8080/user/library", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setLibraryData(data);
            } else {
                console.warn("Failed to fetch library data");
                setLibraryData([]);
            }
        } catch (error) {
            console.error("Error fetching library data:", error);
            setLibraryData([]);
        }
    };
    console.log(libraryData);

    useEffect(() => {
        fetchLibraryData(); // Load once on mount
    }, []);

    return (
        <LibraryContext.Provider value={{ libraryData, fetchLibraryData }}>
            {children}
        </LibraryContext.Provider>
    );
};

export const useLibrary = () => useContext(LibraryContext);