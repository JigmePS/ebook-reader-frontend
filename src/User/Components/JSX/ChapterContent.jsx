import {useReader} from "../../Context/ReaderContext.jsx";
import {useCustomise} from "../../Context/CustomiseContext.jsx";
import "../CSS/Reader.css";
import axios from "axios";
import {useEffect, useState} from "react";

function ChapterContent({chapterId}) {
    const {toggleSticky} = useReader();
    const {fontType, fontSize, lineSpacing, paragraphSpacing} = useCustomise();

    const handleClick = (e) => {
        const middleThird = window.innerHeight / 3;
        const y = e.clientY;

        if (y > middleThird && y < 2 * middleThird) {
            toggleSticky();
        }
    };

    const style = {
        fontFamily: fontType, // <- this is the important line
        fontSize: `${fontSize}px`,
        lineHeight: lineSpacing,
        padding: "2rem"
    };

    const [chapterText, setChapterText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChapterText = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/chapter/text/${chapterId}`, {
                    withCredentials: true,
                });
                setChapterText(response.data.text);
            } catch (err) {
                setError("Failed to load chapter text.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChapterText();
    }, [chapterId]);

    return (

        <div
            className="reader-chapter-content"
            onClick={handleClick}
            style={{ ...style, minHeight: "100vh" }}
        >
            {loading && <p>Loading chapter...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && chapterText.split("\n").map((para, index) => (
                <p key={index} style={{ marginBottom: `${paragraphSpacing}em` }}>
                    {para}
                </p>
            ))}
        </div>
    );
}

export default ChapterContent;
