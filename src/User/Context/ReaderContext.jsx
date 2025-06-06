import React, { createContext, useContext, useState } from "react";

const ReaderContext = createContext();

export const ReaderProvider = ({ children }) => {
    const [isSticky, setIsSticky] = useState(true);

    const toggleSticky = () => {
        setIsSticky(prev => !prev);
    };

    return (
        <ReaderContext.Provider value={{ isSticky, toggleSticky }}>
            {children}
        </ReaderContext.Provider>
    );
};

export const useReader = () => useContext(ReaderContext);