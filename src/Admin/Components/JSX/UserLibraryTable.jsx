import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import { getCustomTableStyles } from "../../../Shared/Theme/tableThemes.jsx";

import '../CSS/AdminTable.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {ArrowLeft01Icon, ArrowRight01Icon, Delete02Icon, Search01Icon} from "@hugeicons/core-free-icons";
import axios from "axios";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";

function UserLibraryTable({title, theme}) {

    //Get library book list for a specific user from the database
    const {userId} = useParams();
    console.log("USER ID:", userId);

    //Get library book list from the database
    const [libraryBooks, setLibraryBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8080/admin/user/${userId}/library`, {withCredentials: true})
            .then(res => {
                setLibraryBooks(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch library books", err);
                setLoading(false);
            });
    }, [userId]);

    //Open delete book modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

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

    const filteredBooks = libraryBooks.filter(item =>
        item.booktitle.toLowerCase().includes(searchTerm)
    );

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredBooks.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "Book ID",
            selector: row => row.bookid,
            sortable: true
        },
        {
            name: "Cover",
            cell: row => (
                row.coverImage ? (
                    <img
                        src={`data:image/jpeg;base64,${row.coverImage}`}
                        alt="cover"
                        width={50}
                        height={70}
                        style={{objectFit: "cover", borderRadius: "5px"}}
                    />
                ) : "No Image"
            ),
            sortable: false,
            width: "150px"
        },
        {
            name: "Title",
            selector: row => row.booktitle,
            sortable: true,
            width: "150px"
        },
        {
            name: "Date Added",
            selector: row => row.addeddate,
            sortable: true
        },
        {
            name: "Progress",
            selector: row => `${row.bookprogress}`,
            sortable: false
        },
        {
            name: "Actions",
            cell: row => (
                <div className="table-action-buttons">
                    <button
                        className="table-delete-btn"
                        onClick={() => {
                            setSelectedItem(row);
                            setShowDeleteModal(true);
                        }}
                    >
                        <HugeiconsIcon icon={Delete02Icon}/>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            button: true
        }
    ];

    //Table styles
    const customStyles = getCustomTableStyles(theme);

    return (
        <>
            <div className="admin-list-title">
                <div className="admin-list-title-name">{title}'s Library</div>
            </div>

            <div className="table-container">
                <div className="table-controls">
                    <div className="table-controls-rows">
                        {/*<label>Show</label>*/}
                        <select value={rowsPerPage} onChange={handleRowsChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={libraryBooks.length}>All</option>
                        </select>
                        <span>entries</span>
                    </div>
                    <div className="table-controls-search">
                        <label>
                            <HugeiconsIcon icon={Search01Icon}/>
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
                    data={currentItems}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    striped
                    responsive
                    highlightOnHover
                    progressPending={loading}
                />

                {showDeleteModal && selectedItem && (
                    <ConfirmationModal
                        message={`Are you sure you want to remove "${selectedItem.booktitle}" from ${title}'s library?`}
                        action="Remove"
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            axios.delete(`http://localhost:8080/admin/user/${userId}/library/remove/${selectedItem.bookid}`, {
                                withCredentials: true
                            })
                                .then(() => {
                                    setLibraryBooks(prev =>
                                        prev.filter(item =>
                                            item.bookid !== selectedItem.bookid
                                        )
                                    );
                                    toast.success("Book removed from Library successfully!");
                                    setShowDeleteModal(false);
                                })
                                .catch(err => {
                                    toast.error("Error removing book from library", err);
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

export default UserLibraryTable;