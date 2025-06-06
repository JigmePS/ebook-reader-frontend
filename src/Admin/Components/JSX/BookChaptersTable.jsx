import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import {useParams} from "react-router-dom";
import { getCustomTableStyles } from "../../../Shared/Theme/tableThemes.jsx";

import '../CSS/AdminTable.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {
    AddSquareIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Delete02Icon,
    PencilEdit02Icon,
    Search01Icon, SquareArrowExpand01Icon
} from "@hugeicons/core-free-icons";
import axios from "axios";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import AddEditChapterModal from "./AddEditChapterModal.jsx";
import ViewChapterModal from "./ViewChapterModal.jsx";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";


function BookChaptersTable({title, theme}) {

    const { refreshSession } = useAuth();

    //Get chapterlist for the book from the database
    const {bookId} = useParams();
    console.log("BOOK ID:", bookId);

    //Get chapter list from the database
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/admin/book/${bookId}/chapters`, {withCredentials: true})
            .then(res => {
                setChapters(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch chapters", err);
                setLoading(false);
            });
    }, [bookId]);

    //Open view chapter modal
    const [viewingChapter, setViewingChapter] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);

    //Open add and edit book chapter modal
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [addEditChapter, setAddEditChapter] = useState(null);

    //Open delete book chapter modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);

    //Pagination & Search
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handlePageChange = (page) => setCurrentPage(page);
    const handleRowsChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const filteredChapters = chapters.filter(chapter =>
        chapter.chaptername.toLowerCase().includes(searchTerm) ||
        chapter.chapternumber.toString().includes(searchTerm)
    );

    const indexOfLastChapter = currentPage * rowsPerPage;
    const indexOfFirstChapter = indexOfLastChapter - rowsPerPage;
    const sortedChapters = [...filteredChapters].sort((a, b) => a.chapternumber - b.chapternumber);
    const currentChapters = sortedChapters.slice(indexOfFirstChapter, indexOfLastChapter);
    const pageCount = Math.ceil(filteredChapters.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "Chapter ID",
            selector: row => row.chapterid,
            sortable: true,
        },
        {
            name: "Chapter Name",
            selector: row => row.chaptername,
            sortable: true,
        },
        {
            name: "Chapter Number",
            selector: row => row.chapternumber,
            sortable: true,
        },
        {
            name: "Actions",
            cell: row => (
                <div className="table-action-buttons">
                    <button
                        className="table-view-btn"
                        onClick={() => {
                            setViewingChapter(row);
                            setViewModalVisible(true);
                        }}
                    >
                        <HugeiconsIcon icon={SquareArrowExpand01Icon}/>
                    </button>
                    <button
                        className="table-edit-btn"
                        onClick={() => {
                            setAddEditChapter(row);
                            setShowAddEditModal(true);
                        }}
                    >
                        <HugeiconsIcon icon={PencilEdit02Icon}/>
                    </button>
                    <button
                        className="table-delete-btn"
                        onClick={() => {
                            setSelectedChapter(row);
                            setShowDeleteModal(true);
                        }}
                    >
                        <HugeiconsIcon icon={Delete02Icon}/>
                    </button>
                </div>
            )
        }
    ];

    //Table styles
    const customStyles = getCustomTableStyles(theme);

    return (
        <>
            <div className="admin-list-title">
                <div className="admin-list-title-name">
                    {title ? `Chapters for ${title}` : `Chapters for Book ID ${bookId}`}
                </div>
                <div className="admin-list-title-actions">
                    <button
                        className="admin-list-add-btn"
                        onClick={() => {
                            setAddEditChapter(null)
                            setShowAddEditModal(true)
                        }}>
                        <HugeiconsIcon icon={AddSquareIcon}/>
                        Add Chapter
                    </button>
                </div>
            </div>

            <div className="table-container">

                <div className="table-controls">
                    <div className="table-controls-rows">
                        {/*<label>Show</label>*/}
                        <select value={rowsPerPage} onChange={handleRowsChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={chapters.length}>All</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="table-controls-search">
                        <label>
                            <HugeiconsIcon
                                icon={Search01Icon}/>
                        </label>
                        <input
                            type="text"
                            placeholder="Search Chapters..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={currentChapters}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    responsive
                    striped
                    highlightOnHover
                    progressPending={loading}
                />

                {viewModalVisible && viewingChapter && (
                    <ViewChapterModal
                        chapterId={viewingChapter.chapterid}
                        chapterNumber={viewingChapter.chapternumber}
                        chapterName={viewingChapter.chaptername}
                        onClose={() => {
                            setViewModalVisible(false);
                            setViewingChapter(null);
                        }}
                    />
                )}

                {showAddEditModal && (
                    <AddEditChapterModal
                        chapter={addEditChapter}
                        bookId={bookId}
                        onClose={() => setShowAddEditModal(false)}
                        onSave={() => {
                            axios.get(`http://localhost:8080/admin/book/${bookId}/chapters`, { withCredentials: true })
                                .then(res => {
                                    refreshSession();
                                    setChapters(res.data);
                                    setShowAddEditModal(false);
                                })
                                .catch(err => {
                                    console.error("Failed to refresh chapter list after save", err);
                                    setShowAddEditModal(false);
                                });
                        }}
                    />
                )}

                {showDeleteModal && (
                    <ConfirmationModal
                        message={`Chapter "${selectedChapter?.chaptername}" will be deleted.`}
                        action="Delete"
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            if (!selectedChapter) return;
                            axios.delete(`http://localhost:8080/admin/chapter/delete/${selectedChapter.chapterid}`, {
                                withCredentials: true
                            })
                                .then(() => {
                                    setChapters(prev => prev.filter(ch => ch.chapterid !== selectedChapter.chapterid));
                                    setShowDeleteModal(false);
                                })
                                .catch(err => {
                                    console.error("Error deleting chapter", err);
                                    setShowDeleteModal(false);
                                });
                        }}
                    />
                )}

                <div className="custom-pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon}/>
                    </button>
                    <span>Page {currentPage} of {pageCount}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                        <HugeiconsIcon icon={ArrowRight01Icon}/>
                    </button>
                </div>
            </div>
        </>
    )
}

export default BookChaptersTable;