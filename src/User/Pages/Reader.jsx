import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ReaderBar from "../Components/JSX/ReaderBar.jsx";
import ChapterContent from "../Components/JSX/ChapterContent.jsx";
import ReaderFooter from "../Components/JSX/ReaderFooter.jsx";
import ReaderLeftChapterSidebar from "../Components/JSX/ReaderLeftChapterSidebar.jsx";
import ReaderRightCustomiseSidebar from "../Components/JSX/ReaderRightCustomiseSidebar.jsx";

import "../Background.css"

function Reader() {

    const { bookId, chapterNo } = useParams();
    const [chapter, setChapter] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChapterAndChapters = async () => {
            setLoading(true);
            setError(null);
            try {
                const [chapterRes, allChaptersRes] = await Promise.all([
                    axios.get(`http://localhost:8080/user/books/${bookId}/chapters/${chapterNo}`, {
                        withCredentials: true
                    }),
                    axios.get(`http://localhost:8080/user/books/${bookId}/chapters`, {
                        withCredentials: true
                    })
                ]);

                setChapter(chapterRes.data);
                setChapters(allChaptersRes.data);
            } catch (err) {
                console.error("Failed to load chapter(s):", err);
                setError("Failed to load chapter(s)");
            } finally {
                setLoading(false);
            }
        };

        fetchChapterAndChapters();
    }, [bookId, chapterNo]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [chapterNo]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <ReaderLeftChapterSidebar chapter={chapter} chapters={chapters}/>
            <ReaderRightCustomiseSidebar/>
            <ReaderBar chapter={chapter}/>
            <div className="reader-content-background">
                <ChapterContent chapterId={chapter.id}/>
            </div>
            <ReaderFooter chapter={chapter} totalChapters={chapters.length}/>
        </>
    )
}

export default Reader;