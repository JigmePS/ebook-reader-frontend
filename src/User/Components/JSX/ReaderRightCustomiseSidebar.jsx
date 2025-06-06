import {useReaderSidebar} from "../../Context/ReaderSidebarContext.jsx";
import {useCustomise} from "../../Context/CustomiseContext.jsx";
import '../CSS/ReaderSidebar.css';
import FontPicker from "./FontPicker.jsx";
import {useState} from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {Add01Icon, Cancel01Icon, MinusSignIcon} from "@hugeicons/core-free-icons";

function ReaderRightCustomiseSidebar() {
    const {rightOpen, closeReaderSidebars} = useReaderSidebar();
    const {
        fontType, setFontType,
        fontSize, setFontSize,
        lineSpacing, setLineSpacing,
        paragraphSpacing, setParagraphSpacing
    } = useCustomise();

    const createControl = (value, setValue, min, max, step = 1) => {
        const [inputValue, setInputValue] = useState(value);

        const applyClamp = () => {
            let val = parseFloat(inputValue);
            if (isNaN(val)) val = value; // fallback to last good value
            val = Math.min(max, Math.max(min, val));
            setValue(Number(val.toFixed(2)));
            setInputValue(Number(val.toFixed(2)));
        };

        return {
            inputValue,
            setInputValue,
            applyClamp,
            increase: () => {
                const newValue = Math.min(max, value + step);
                setValue(Number(newValue.toFixed(2)));
                setInputValue(Number(newValue.toFixed(2)));
            },
            decrease: () => {
                const newValue = Math.max(min, value - step);
                setValue(Number(newValue.toFixed(2)));
                setInputValue(Number(newValue.toFixed(2)));
            }
        };
    };

    const fontSizeControl = createControl(fontSize, setFontSize, 12, 36, 1);
    const lineSpacingControl = createControl(lineSpacing, setLineSpacing, 1, 3, 0.1);
    const paragraphSpacingControl = createControl(paragraphSpacing, setParagraphSpacing, 0.5, 3, 0.1);

    return (
        <div className={`reader-sidebar right ${rightOpen ? "open" : ""}`}>
            <div className="sidebar-content">
                <div className="right-reader-sidebar-title-container">
                    <div className="right-reader-sidebar-title">Settings</div>
                    <button
                        className="reader-sidebar-close-btn"
                        onClick={closeReaderSidebars}>
                        <HugeiconsIcon icon={Cancel01Icon} size="1.8rem"/>
                    </button>
                </div>
                <div className="setting-group">
                    <label>Font Type</label>
                    <FontPicker fontType={fontType} setFontType={setFontType}/>
                </div>

                <div className="setting-group">
                    <label>Font Size (px)</label>
                    <div className="button-controls">
                        <button
                            className="decrease-btn"
                            onClick={fontSizeControl.decrease}>
                            <HugeiconsIcon icon={MinusSignIcon}/>
                        </button>
                        <input
                            type="number"
                            value={fontSizeControl.inputValue}
                            onChange={(e) => fontSizeControl.setInputValue(e.target.value)}
                            onBlur={fontSizeControl.applyClamp}
                            onKeyDown={(e) => e.key === "Enter" && fontSizeControl.applyClamp()}
                        />
                        <button
                            className="increase-btn"
                            onClick={fontSizeControl.increase}>
                            <HugeiconsIcon icon={Add01Icon}/>
                        </button>
                    </div>
                </div>

                <div className="setting-group">
                    <label>Line Spacing</label>
                    <div className="button-controls">
                        <button
                            className="decrease-btn"
                            onClick={lineSpacingControl.decrease}>
                            <HugeiconsIcon icon={MinusSignIcon}/>
                        </button>
                        <input
                            type="number"
                            step="0.1"
                            value={lineSpacingControl.inputValue}
                            onChange={(e) => lineSpacingControl.setInputValue(e.target.value)}
                            onBlur={lineSpacingControl.applyClamp}
                            onKeyDown={(e) => e.key === "Enter" && lineSpacingControl.applyClamp()}
                        />
                        <button
                            className="increase-btn"
                            onClick={lineSpacingControl.increase}>
                            <HugeiconsIcon icon={Add01Icon}/>
                        </button>
                    </div>
                </div>

                <div className="setting-group">
                    <label>Paragraph Spacing</label>
                    <div className="button-controls">
                        <button
                            className="decrease-btn"
                            onClick={paragraphSpacingControl.decrease}>
                            <HugeiconsIcon icon={MinusSignIcon}/>
                        </button>
                        <input
                            type="number"
                            step="0.1"
                            value={paragraphSpacingControl.inputValue}
                            onChange={(e) => paragraphSpacingControl.setInputValue(e.target.value)}
                            onBlur={paragraphSpacingControl.applyClamp}
                            onKeyDown={(e) => e.key === "Enter" && paragraphSpacingControl.applyClamp()}
                        />
                        <button
                            className="increase-btn"
                            onClick={paragraphSpacingControl.increase}>
                            <HugeiconsIcon icon={Add01Icon}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReaderRightCustomiseSidebar;
