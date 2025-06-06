import {useReaderSidebar} from "../../Context/ReaderSidebarContext.jsx";
import '../CSS/ReaderSidebar.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useLibrary} from "../../Context/LibraryContext.jsx";
import {useState} from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";

function ReaderLeftChapterSidebar({chapter, chapters}) {
    const {leftOpen, closeReaderSidebars} = useReaderSidebar();

    const {libraryData} = useLibrary();
    const navigate = useNavigate();

    // Match the current book in the user's library
    const matchedLibraryItem = libraryData?.find(item => item.bookid === chapter.bookId);
    const libraryBookId = matchedLibraryItem?.librarybookid;

    const handleChapterClick = async (chapterNo) => {
        if (!libraryBookId) return;

        try {
            await axios.put(`http://localhost:8080/user/library/${libraryBookId}/progress`, {
                progress: chapterNo,
            }, {
                withCredentials: true
            });

            navigate(`/chapter/${chapter.bookId}/${chapterNo}`);
            closeReaderSidebars();
        } catch (err) {
            console.error("Failed to update reading progress", err);
        }
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const pageCount = Math.ceil((chapters?.length || 0) / entriesPerPage);
    const offset = currentPage * entriesPerPage;
    const currentChapters = chapters?.slice(offset, offset + entriesPerPage) || [];

    const renderPaginationControls = () => (
        <div className="reader-sidebar-pagination">
            {Array.from({length: pageCount}, (_, i) => {
                const pageChapters = chapters.slice(i * entriesPerPage, (i + 1) * entriesPerPage);
                const first = pageChapters[0]?.number;
                const last = pageChapters[pageChapters.length - 1]?.number;
                const label = `${first}-${last}`;
                return (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`reader-sidebar-page-btn ${currentPage === i ? "active" : ""}`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className={`reader-sidebar left ${leftOpen ? "open" : ""}`}>
            <div className="sidebar-content">
                <div className="left-reader-sidebar-title-container">
                    <div className="left-reader-sidebar-title">Table of Contents</div>
                    <button
                        className="reader-sidebar-close-btn"
                        onClick={closeReaderSidebars}>
                        <HugeiconsIcon icon={Cancel01Icon} size="1.8rem"/>
                    </button>
                </div>

                <div className="reader-sidebar-entries-select">
                    {renderPaginationControls()}
                    <div className="reader-sidebar-entries-select-content">
                        <select
                            value={entriesPerPage}
                            onChange={e => {
                                setEntriesPerPage(Number(e.target.value));
                                setCurrentPage(0); // reset to page 0 when entry count changes
                            }}
                        >
                            {[10, 20, 50].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <ul className="reader-sidebar-chapter-list">
                    {currentChapters.map((ch) => (
                        <li key={ch.id} className={ch.number === chapter.number ? "current" : ""}>
                            <button onClick={() => handleChapterClick(ch.number)}>
                                Chapter {ch.number}: {ch.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ReaderLeftChapterSidebar;