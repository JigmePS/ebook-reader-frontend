import React, { useState } from "react";
import "../CSS/FontPicker.css"
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowDown01Icon} from "@hugeicons/core-free-icons";

const fonts = [
    { label: "Lora", value: "'Lora', serif" },
    { label: "Karla", value: "'Karla', sans-serif" },
    { label: "Rubik", value: "'Rubik', sans-serif" },
    { label: "Cardo", value: "'Cardo', serif" },
    { label: "Nunito", value: "'Nunito', sans-serif" },
    { label: "Merriweather", value: "'Merriweather', serif" }
];

function FontPicker({ fontType, setFontType }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="font-picker">
            <button onClick={() => setOpen(!open)} style={{ fontFamily: fontType }}>
                {fontType}
                <HugeiconsIcon icon={ArrowDown01Icon}/>
            </button>
            {open && (
                <div className="font-picker-dropdown">
                    {fonts.map((font) => (
                        <div
                            key={font.label}
                            onClick={() => {
                                setFontType(font.value);
                                setOpen(false);
                            }}
                            style={{ fontFamily: font.value, padding: "0.5rem", cursor: "pointer" }}
                        >
                            {font.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FontPicker;
