import { useReader } from "../../Context/ReaderContext.jsx";
import { useCustomise } from "../../Context/CustomiseContext.jsx";
import { useLibrary } from "../../Context/LibraryContext.jsx";
import "../CSS/Reader.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get bookId from URL

function ChapterContent({ chapterId }) {
    const { toggleSticky } = useReader();
    const { fontType, fontSize, lineSpacing, paragraphSpacing } = useCustomise();
    const { libraryData } = useLibrary();
    const { bookId } = useParams(); // current book ID from route

    const [chapterText, setChapterText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user owns the book
    const isAuthorized = libraryData.some((entry) => String(entry.bookid) === String(bookId));

    const handleClick = (e) => {
        const middleThird = window.innerHeight / 3;
        const y = e.clientY;

        if (y > middleThird && y < 2 * middleThird) {
            toggleSticky();
        }
    };

    const style = {
        fontFamily: fontType,
        fontSize: `${fontSize}px`,
        lineHeight: lineSpacing,
        padding: "2rem"
    };

    useEffect(() => {
        const fetchChapterText = async () => {
            if (!isAuthorized) return;

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
    }, [chapterId, isAuthorized]);

    if (!isAuthorized) {
        return (
            <div className="reader-chapter-content" style={{ ...style, minHeight: "100vh" }}>
                <p className="error-text">You are not authorised to view this content.</p>
            </div>
        );
    }

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
