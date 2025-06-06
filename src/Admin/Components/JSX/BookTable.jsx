import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import {Tooltip} from "react-tooltip";
import { Rating } from "react-simple-star-rating";
import { getCustomTableStyles } from "../../../Shared/Theme/tableThemes.jsx";

import '../CSS/AdminTable.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {
    AddSquareIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon, Delete02Icon,
    PencilEdit02Icon,
    Search01Icon
} from "@hugeicons/core-free-icons";
import axios from "axios";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import AddEditBookModal from "./AddEditBookModal.jsx";
import {Link} from "react-router-dom";

function BookTable({title, theme}) {

    //Get book list from the database
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/admin/book/all", {withCredentials: true})
            .then(res => {
                console.log("BOOK RESPONSE:", res.data);
                setBooks(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch books", err);
                setLoading(false);
            });
    }, []);

    //Open edit user modal
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [addEditBook, setAddEditBook] = useState(null);

    //Open delete user modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

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

    const filteredBooks = books.filter(book =>
        book.booktitle.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genres.some(g => g.genrename.toLowerCase().includes(searchTerm))
    );

    const indexOfLastBook = currentPage * rowsPerPage;
    const indexOfFirstBook = indexOfLastBook - rowsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const pageCount = Math.ceil(filteredBooks.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "Book ID",
            selector: row => row.bookid,
            sortable: true,
            width: "90px"
        },
        {
            name: "Cover",
            selector: row => row.coverImage ? (
                <img
                    src={`data:image/jpeg;base64,${row.coverImage}`}
                    alt="Cover"
                    className="table-image"
                />
            ) : (
                <span>No image</span>
            ),
            sortable: false,
        },
        {
            name: "Title",
            cell: row => {
                const text = row.booktitle || "Untitled";
                const tooltipId = `title-tooltip-${row.bookid}`;
                return (
                    <>
                        <Link
                            className={"admin-table-link"}
                            to={`/book-management/${row.bookid}/chapters`}
                            state={{ booktitle: row.booktitle }}
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={text}
                            style={{
                                textDecoration: "underline",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 150,
                                display: "inline-block"
                            }}
                        >
                            {text}
                        </Link>
                        <Tooltip id={tooltipId} place="top" />
                    </>
                );
            },
            sortable: true,
        },
        {
            name: "Author",
            cell: row => {
                const text = row.author || "Unknown";
                const tooltipId = `author-tooltip-${row.bookid}`;
                return (
                    <>
                        <div
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={text}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 150,
                            }}
                        >
                            {text}
                        </div>
                        <Tooltip id={tooltipId} place="top" />
                    </>
                );
            },
            sortable: true,
        },
        {
            name: "Genres",
            cell: row => {
                const text = row.genres?.map(g => g.genrename).join(", ") || "None";
                const tooltipId = `genre-tooltip-${row.bookid}`;
                return (
                    <>
                        <div
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={text}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 150,
                            }}
                        >
                            {text}
                        </div>
                        <Tooltip id={tooltipId} place="top" />
                    </>
                );
            },
            sortable: false,
            // width: "200px",
        },
        {
            name: "Description",
            cell: row => {
                const text = row.description || "No description";
                const tooltipId = `desc-tooltip-${row.bookid}`;
                return (
                    <>
                        <div
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={text}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 150,
                            }}
                        >
                            {text}
                        </div>
                        <Tooltip
                            id={tooltipId}
                            place="top"
                            render={({ content }) => (
                                <div style={{
                                    maxWidth: '300px',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    padding: '8px',
                                    fontSize: '14px'
                                }}>
                                    {content}
                                </div>
                            )}
                        />
                    </>
                );
            },
            sortable: false,
        },
        {
            name: "Rating",
            cell: row => {
                const avg = parseFloat(row.averageRating || 0);
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                            readonly
                            initialValue={avg}
                            allowFraction
                            size={18}
                            fillColor="#ffd700"
                            emptyColor="#e0e0e0"
                            SVGstyle={{ display: 'inline-block' }}
                        />
                        <span style={{ marginLeft: 8, fontSize: '0.85rem' }}>
                    {avg.toFixed(1)} / 5
                </span>
                    </div>
                );
            },
            sortable: false,
            width: "180px",
        },
        {
            name: "Price",
            selector: row => `$${row.price}`,
            sortable: true,
        },
        {
            name: "Chapters",
            selector: row => row.chapters?.length ?? 0,
            sortable: true,
            width: "100px",
        },
        {
            name: "Published",
            selector: row => row.publishdate,
            sortable: true,
        },
        {
            name: "Sold",
            selector: row => row.sold,
            sortable: true,
            width: "80px",
        },
        {
            name: "Views",
            selector: row => row.views,
            sortable: true,
            width: "80px",
        },
        {
            name: "Actions",
            selector: row => (
                <div className="table-action-buttons">
                    <button
                        className="table-edit-btn"
                        onClick={() => {
                            setAddEditBook(row)
                            setShowAddEditModal(true)
                        }}>
                        <HugeiconsIcon icon={PencilEdit02Icon}/>
                    </button>
                    <button
                        className="table-delete-btn"
                        onClick={() => {
                            setSelectedBook(row)
                            setShowDeleteModal(true)
                        }}>
                        <HugeiconsIcon icon={Delete02Icon}/>
                    </button>
                </div>
            ),
            sortable: false
        }
    ];

    //Table styles
    const customStyles = getCustomTableStyles(theme);

    return (
        <>
            <div className="admin-list-title">
                <div className="admin-list-title-name">{title}</div>
                <div className="admin-list-title-actions">
                    <button
                        className="admin-list-add-btn"
                        onClick={() => {
                            setAddEditBook(null)
                            setShowAddEditModal(true)
                        }}>
                        <HugeiconsIcon icon={AddSquareIcon}/>
                        Add Book
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
                            <option value={books.length}>All</option>
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
                            placeholder="Search Books..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={currentBooks}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    responsive
                    striped
                    highlightOnHover
                    progressPending={loading}
                />

                {showAddEditModal && (
                    <AddEditBookModal
                        book={addEditBook}
                        onClose={() => setShowAddEditModal(false)}
                        onSave={(savedBook) => {
                            setBooks(prev => {
                                const exists = prev.some(b => b.bookid === savedBook.bookid);
                                return exists
                                    ? prev.map(b => b.bookid === savedBook.bookid ? savedBook : b)
                                    : [...prev, savedBook];
                            });
                            setShowAddEditModal(false);
                        }}
                    />
                )}

                {showDeleteModal && (
                    <ConfirmationModal
                        message={`Book "${selectedBook?.booktitle}" will be deleted.`}
                        action={"Delete"}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            if (!selectedBook) return;
                            axios.delete(`http://localhost:8080/admin/book/delete/${selectedBook.bookid}`, {
                                withCredentials: true
                            })
                                .then(() => {
                                    setBooks(prev => prev.filter(b => b.bookid !== selectedBook.bookid));
                                    setShowDeleteModal(false);
                                })
                                .catch(err => {
                                    console.error("Error deleting book", err);
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

export default BookTable;