import React, { createContext, useContext, useState } from "react";

const CustomiseContext = createContext();

export const CustomiseProvider = ({ children }) => {
    const [fontType, setFontType] = useState("'Lora', serif");
    const [fontSize, setFontSize] = useState(18);
    const [lineSpacing, setLineSpacing] = useState(1.6);
    const [paragraphSpacing, setParagraphSpacing] = useState(1.5);

    return (
        <CustomiseContext.Provider value={{
            fontType,
            setFontType,
            fontSize,
            setFontSize,
            lineSpacing,
            setLineSpacing,
            paragraphSpacing,
            setParagraphSpacing
        }}>
            {children}
        </CustomiseContext.Provider>
    );
};

export const useCustomise = () => useContext(CustomiseContext);
