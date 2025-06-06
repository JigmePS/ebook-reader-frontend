import "../CSS/ReaderBarFooter.css"
import {HugeiconsIcon} from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    LeftToRightListBulletIcon,
    Moon02FreeIcons,
    Settings03Icon, Sun02FreeIcons, Sun03FreeIcons
} from "@hugeicons/core-free-icons";
import {useReader} from "../../Context/ReaderContext.jsx";
import {useReaderSidebar} from "../../Context/ReaderSidebarContext.jsx";
import {useLibrary} from "../../Context/LibraryContext.jsx";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../../Shared/Context/ThemeContext.jsx";
import axios from "axios";

function ReaderFooter({ chapter, totalChapters }) {

    const {isSticky} = useReader();
    const {toggleLeft, toggleRight} = useReaderSidebar();

    const { fetchLibraryData, libraryData } = useLibrary();
    const navigate = useNavigate();

    // Match entry from UserLibraryDTO
    const matchedLibraryItem = libraryData?.find(item => item.bookid === chapter.bookId);
    const libraryBookId = matchedLibraryItem?.librarybookid;

    const updateProgressAndNavigate = async (newChapterNo) => {
        if (!libraryBookId) return;

        try {
            await axios.put(`http://localhost:8080/user/library/${libraryBookId}/progress`, {
                progress: newChapterNo,
            }, {
                withCredentials: true
            });
            fetchLibraryData();
            navigate(`/chapter/${chapter.bookId}/${newChapterNo}`);
        } catch (err) {
            console.error("Failed to update reading progress", err);
        }
    };

    const handlePrev = () => {
        if (chapter.number > 1) {
            updateProgressAndNavigate(chapter.number - 1);
        }
    };

    const handleNext = () => {
        if (chapter.number < totalChapters) {
            updateProgressAndNavigate(chapter.number + 1);
        }
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <footer className={`reader-footer ${isSticky ? "sticky" : ""}`}>
            <div className="reader-footer-content">
                <div className="reader-footer-content-left">
                    <button
                        className="reader-footer-previous"
                        onClick={handlePrev}
                        disabled={chapter.number <= 1}
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size="1.9rem" />
                        <span>Prev</span>
                    </button>
                </div>
                <div className="reader-footer-content-center">
                    <div className="reader-footer-action-container">
                        <button className="reader-footer-action footer-chapters" onClick={toggleLeft}>
                            <HugeiconsIcon icon={LeftToRightListBulletIcon} size="1.9rem" />
                        </button>
                        <button className="reader-footer-action footer-dark-mode" onClick={toggleTheme}>
                            <HugeiconsIcon icon={theme === "light" ? Sun03FreeIcons : Moon02FreeIcons} size="1.9rem" />
                        </button>
                        <button className="reader-footer-action footer-customize" onClick={toggleRight}>
                            <HugeiconsIcon icon={Settings03Icon} size="1.9rem" />
                        </button>
                    </div>
                </div>
                <div className="reader-footer-content-right">
                    <button
                        className="reader-footer-next"
                        onClick={handleNext}
                        disabled={chapter.number >= totalChapters}
                    >
                        <span>Next</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size="1.9rem" />
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default ReaderFooter;