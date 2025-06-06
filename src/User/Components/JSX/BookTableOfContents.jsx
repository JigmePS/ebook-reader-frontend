import {useState, useMemo} from "react";
import "../CSS/Book.css";
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrangeByNumbers19Icon, ArrangeByNumbers91Icon} from "@hugeicons/core-free-icons";
import {Link, useNavigate} from "react-router-dom";
import {useLibrary} from "../../Context/LibraryContext.jsx";
import axios from "axios";

function BookTableOfContents({chapters, bookId}) {

    const { fetchLibraryData, libraryData } = useLibrary();
    const navigate = useNavigate();

    // Match entry from UserLibraryDTO
    const matchedLibraryItem = libraryData?.find(item => item.bookid === bookId);
    const libraryBookId = matchedLibraryItem?.librarybookid;

    console.log("Library book id:", libraryBookId);

    const handleChapterClick = async (chapterNo) => {
        try {
            // Increase view count
            await axios.put(`http://localhost:8080/user/book/${bookId}/view`, {}, {
                withCredentials: true
            });

            // Update reading progress if the book is in library
            if (libraryBookId) {
                await axios.put(`http://localhost:8080/user/library/${libraryBookId}/progress`, {
                    progress: chapterNo,
                }, {
                    withCredentials: true
                });
            }

            fetchLibraryData();
            // Navigate to chapter
            navigate(`/chapter/${bookId}/${chapterNo}`);
        } catch (err) {
            console.error("Error handling chapter click:", err);
        }
    };

    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [ascending, setAscending] = useState(true);

    const totalChapters = chapters?.length || 0;

    const sortedChapters = useMemo(() => {
        if (!chapters) return [];
        return [...chapters].sort((a, b) =>
            ascending ? a.number - b.number : b.number - a.number
        );
    }, [chapters, ascending]);

    const pageCount = Math.ceil(totalChapters / entriesPerPage);

    const offset = currentPage * entriesPerPage;
    const currentChapters = sortedChapters.slice(offset, offset + entriesPerPage);

    const columns = 2;
    const rows = [];
    for (let i = 0; i < currentChapters.length; i += columns) {
        rows.push(currentChapters.slice(i, i + columns));
    }

    const renderCustomPageNumbers = () => {
        const pages = [];
        for (let i = 0; i < pageCount; i++) {
            const pageChapters = sortedChapters.slice(i * entriesPerPage, (i + 1) * entriesPerPage);
            if (pageChapters.length === 0) continue;

            const first = pageChapters[0]?.number;
            const last = pageChapters[pageChapters.length - 1]?.number;
            const label = ascending
                ? `${first}-${last}`
                : `${first}-${last}`; // First will be higher in descending

            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`pagination-page-btn ${currentPage === i ? "active" : ""}`}
                >
                    {label}
                </button>
            );
        }
        return <div className="chapter-number-group-pagination">{pages}</div>;
    };


    return (
        <div className="book-info-tab-content active-content">
            <div className="book-chapter-filter">
                <div className="book-chapter-number-page-container">
                    {renderCustomPageNumbers()}
                </div>

                <div className="book-chapter-filter-action">
                    <select
                        className="book-chapter-filter-select"
                        value={entriesPerPage} onChange={e => {
                        setEntriesPerPage(Number(e.target.value));
                        setCurrentPage(0);
                    }} >
                        {[10, 20, 50].map((num) => (
                            <option key={num} value={num}>
                                {num} {/*<div className="book-chapter-entry-value">per page</div>*/}
                            </option>
                        ))}
                    </select> <span className="book-chapter-entry-value">per page</span>

                    <button
                        className="book-chapter-order-btn"
                        onClick={() => {
                            setAscending(!ascending);
                            setCurrentPage(0); // Reset page to first when sorting changes
                        }}
                        aria-label="Toggle ascending/descending"
                    >
                        {ascending
                            ? <HugeiconsIcon icon={ArrangeByNumbers19Icon} size="2rem"/>  // or <ArrowDownIcon />
                            : <HugeiconsIcon icon={ArrangeByNumbers91Icon} size="2rem"/>    // or <ArrowUpIcon />
                        }
                    </button>
                </div>
            </div>

            <div className="book-chapter-list-container">
                <ul className="book-chapter-list">
                    {currentChapters.map((chapter) => (
                        <button
                            key={chapter.number}
                            onClick={() => handleChapterClick(chapter.number)}
                            className="book-chapter-link"
                        >
                            <div className="book-chapter-link-number">{chapter.number}</div>
                            <div className="book-chapter-link-name">{chapter.name}</div>
                        </button>
                    ))}
                </ul>
            </div>
        </div>
    )
        ;
}

export default BookTableOfContents;
