import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import { Tooltip } from "react-tooltip";
import { Rating } from "react-simple-star-rating";
import { getCustomTableStyles } from "../../../Shared/Theme/tableThemes.jsx";

import '../CSS/AdminTable.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {AddSquareIcon, ArrowLeft01Icon, ArrowRight01Icon, Delete02Icon, Search01Icon} from "@hugeicons/core-free-icons";
import axios from "axios";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import {useParams} from "react-router-dom";


function UserReviewsTable({title, theme}) {

    //Get chapterlist from a user from the database
    const {userId} = useParams();
    console.log("USER ID:", userId);

    //Get a review list from the database
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/admin/user/${userId}/review`, {withCredentials: true})
            .then(res => {
                setReviews(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch user reviews", err);
                setLoading(false);
            });
    }, [userId]);

    console.log("REVIEWS:", reviews);

    //Open delete user review modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

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

    const filteredReviews = reviews.filter(review =>
        review.booktitle?.toLowerCase().includes(searchTerm) ||
        review.reviewdescription?.toLowerCase().includes(searchTerm)
    );

    const indexOfLastReview = currentPage * rowsPerPage;
    const indexOfFirstReview = indexOfLastReview - rowsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
    const pageCount = Math.ceil(filteredReviews.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "Review ID",
            selector: row => row.reviewid,
            sortable: true,
        },
        {
            name: "Book Title",
            cell: (row) => {
                const text = row.booktitle || "N/A";
                const tooltipId = `title-tooltip-${row.reviewid}`;
                return (
                    <>
                        <div
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={text}
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 200,
                                cursor: "default",
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
            name: "Rating",
            cell: (row) => {
                const ratingValue = parseFloat(row.rating || 0);
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Rating
                            readonly
                            initialValue={ratingValue}
                            allowFraction
                            size={18}
                            fillColor="#ffd700"
                            emptyColor="#e0e0e0"
                            SVGstyle={{ display: "inline-block" }}
                        />
                        <span style={{ marginLeft: 8, fontSize: "0.85rem" }}>
              {ratingValue.toFixed(1)} / 5
            </span>
                    </div>
                );
            },
            sortable: true,
            width: "180px"
        },
        {
            name: "Description",
            cell: (row) => {
                const text = row.reviewdescription || "—";
                const tooltipId = `desc-tooltip-${row.reviewid}`;
                return (
                    <>
                        <div
                            data-tooltip-id={tooltipId}
                            data-tooltip-content={text}
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 250,
                                cursor: "default",
                            }}
                        >
                            {text}
                        </div>
                        <Tooltip
                            id={tooltipId}
                            place="top"
                            render={({ content }) => (
                                <div
                                    style={{
                                        maxWidth: "300px",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        padding: "8px",
                                        fontSize: "14px",
                                    }}
                                >
                                    {content}
                                </div>
                            )}
                        />
                    </>
                );
            },
            sortable: false,
            wrap: true
        },
        {
            name: "Review Date",
            selector: row => new Date(row.reviewdate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: "Actions",
            cell: row => (
                <div className="table-action-buttons">
                    <button className="table-delete-btn" onClick={() => {
                        setSelectedReview(row);
                        setShowDeleteModal(true);
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
                <div className="admin-list-title-name">{title}'s book reviews</div>
            </div>

            <div className="table-container">
                <div className="table-controls">
                    <div className="table-controls-rows">
                        {/*<label>Show</label>*/}
                        <select value={rowsPerPage} onChange={handleRowsChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={filteredReviews.length}>All</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="table-controls-search">
                        <label><HugeiconsIcon icon={Search01Icon}/></label>
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={currentReviews}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    responsive
                    striped
                    highlightOnHover
                    progressPending={loading}
                />

                {showDeleteModal && (
                    <ConfirmationModal
                        message={`Review for book "${selectedReview?.booktitle}" will be deleted.`}
                        action={"Delete"}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            if (!selectedReview) return;
                            axios.delete(`http://localhost:8080/admin/review/delete/${selectedReview.reviewid}`, {
                                withCredentials: true
                            })
                                .then(() => {
                                    setReviews(prev => prev.filter(r => r.reviewid !== selectedReview.reviewid));
                                    setShowDeleteModal(false);
                                })
                                .catch(err => {
                                    console.error("Error deleting review", err);
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

export default UserReviewsTable;