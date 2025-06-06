import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {useLibrary} from "../../Context/LibraryContext.jsx";

function ChapterTest() {
    const { bookId, chapterNo } = useParams();
    const [chapter, setChapter] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChapter() {
            try {
                const response = await axios.get(
                    `http://localhost:8080/user/books/${bookId}/chapters/${chapterNo}`,
                    {
                        withCredentials: true  // 👈 Important line
                    }
                );
                setChapter(response.data);
                setError(null);
            } catch (err) {
                console.error("Error loading chapter:", err);
                if (err.response && err.response.status === 404) {
                    setError("Chapter not found.");
                } else {
                    setError("Failed to load chapter.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchChapter();
    }, [bookId, chapterNo]);

    if (loading) return <div>Loading chapter...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="chapter-reader">
            <h2>Chapter {chapter.number}: {chapter.name}</h2>
            {/* You can render PDF content or text here later */}
        </div>
    );
}

export default ChapterTest;