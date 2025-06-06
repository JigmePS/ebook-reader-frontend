import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
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
import AddEditGenreModal from "./AddEditGenreModal.jsx";


function GenreTable({title, theme}) {

    //Get genre list from the database
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/admin/genre/all", {withCredentials: true})
            .then(res => {
                setGenres(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch genres", err);
                setLoading(false);
            });
    }, []);

    //Open add and edit user modal
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [addEditGenre, setAddEditGenre] = useState(null);

    //Open delete user modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);

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

    const filteredGenres = genres.filter(genre =>
        genre.genrename.toLowerCase().includes(searchTerm)
    );

    const indexOfLastGenre = currentPage * rowsPerPage;
    const indexOfFirstGenre = indexOfLastGenre - rowsPerPage;
    const currentGenres = filteredGenres.slice(indexOfFirstGenre, indexOfLastGenre);
    const pageCount = Math.ceil(filteredGenres.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "Genre ID",
            selector: row => row.genreid,
            sortable: true
        },
        {
            name: "Genre",
            selector: row => row.genrename,
            sortable: true,
            width: "150px"
        },
        {
            name: "Books",
            selector: row => row.books?.length || 0,
            sortable: true
        },
        {
            name: "Actions",
            selector: row => (
                <div className="table-action-buttons">
                    <button
                        className="table-edit-btn"
                        onClick={() => {
                            setAddEditGenre(row)
                            setShowAddEditModal(true)
                        }}>
                        <HugeiconsIcon icon={PencilEdit02Icon}/>
                    </button>
                    <button
                        className="table-delete-btn"
                        onClick={() => {
                            setSelectedGenre(row)
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
                            setAddEditGenre(null)
                            setShowAddEditModal(true)
                        }}>
                        <HugeiconsIcon icon={AddSquareIcon}/>
                        Add Genre
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
                            <option value={genres.length}>All</option>
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
                            placeholder="Search Genres..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={currentGenres}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    responsive
                    striped
                    highlightOnHover
                    progressPending={loading}
                />

                {showAddEditModal && (
                    <AddEditGenreModal
                        genre={addEditGenre}
                        onClose={() => setShowAddEditModal(false)}
                        onSave={(savedGenre) => {
                            setGenres(prev => {
                                const exists = prev.find(g => g.genreid === savedGenre.genreid);
                                const newGenres = exists
                                    ? prev.map(g => g.genreid === savedGenre.genreid ? savedGenre : g)
                                    : [...prev, savedGenre];
                                if (!exists) {
                                    const newTotal = newGenres.length;
                                    const newPageCount = Math.ceil(newTotal / rowsPerPage);
                                    setCurrentPage(newPageCount);
                                }
                                return newGenres;
                            });
                        }}
                    />
                )}

                {showDeleteModal && (
                    <ConfirmationModal
                        message={`Genre "${selectedGenre?.genrename}" will be deleted.`}
                        action={"Delete"}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            if (!selectedGenre) return;
                            axios.delete(`http://localhost:8080/admin/genre/delete/${selectedGenre.genreid}`, {
                                withCredentials: true
                            })
                                .then(() => {
                                    setGenres(prev => prev.filter(g => g.genreid !== selectedGenre.genreid));
                                    setShowDeleteModal(false);
                                })
                                .catch(err => {
                                    console.error("Error deleting genre", err);
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

export default GenreTable;