import React, { createContext, useContext, useState } from "react";

const ReaderSidebarContext = createContext();

export const ReaderSidebarProvider = ({ children }) => {
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);

    const toggleLeft = () => {
        if (!leftOpen) {
            setLeftOpen(true);
            setRightOpen(false);
        } else {
            setLeftOpen(false);
        }
    };

    const toggleRight = () => {
        if (!rightOpen) {
            setRightOpen(true);
            setLeftOpen(false);
        } else {
            setRightOpen(false);
        }
    };

    const closeReaderSidebars = () => {
        setLeftOpen(false);
        setRightOpen(false);
    };

    return (
        <ReaderSidebarContext.Provider value={{ leftOpen, rightOpen, toggleLeft, toggleRight, closeReaderSidebars }}>
            {children}
        </ReaderSidebarContext.Provider>
    );
};

export const useReaderSidebar = () => useContext(ReaderSidebarContext);