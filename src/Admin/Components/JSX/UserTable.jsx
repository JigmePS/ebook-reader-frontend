import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import { getCustomTableStyles } from "../../../Shared/Theme/tableThemes.jsx";


import '../CSS/AdminTable.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon, Delete02Icon,
    LinkSquare01Icon,
    PencilEdit02Icon,
    Search01Icon
} from "@hugeicons/core-free-icons";
import axios from "axios";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import {Link} from "react-router-dom";

function UserTable({title, theme}) {

    //Get user list from the database
    const [users, setUsers] = useState([]);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/admin/user/all", {withCredentials: true})
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch users:", error);
                setLoading(false);
            });
    }, []);

    //Open edit user modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    //Open delete user modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    const indexOfLastUser = currentPage * rowsPerPage;
    const indexOfFirstUser = indexOfLastUser - rowsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "User ID",
            selector: row => row.userid,
            sortable: true
        },
        {
            name: "Picture",
            selector: row => row.picture ? (
                <img
                    src={`data:image/jpeg;base64,${row.picture}`}
                    alt="User"
                    className="table-image"
                />
            ) : (
                <span>No image</span>
            ),
            sortable: false
        },
        {
            name: "Username",
            selector: row => row.username,
            sortable: true,
            width: "150px"
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
            width: "200px"
        },
        {
            name: "Created",
            selector: row => row.createdate,
            sortable: true,
        },
        {
            name: "Library",
            cell: row => {
                const count = row.userLibrary?.length || 0;
                return (
                    <>
                        {count}
                        <Link
                            to={`/user-management/${row.userid}/library`}
                            state={{username: row.username}}
                            style={{
                                color: "#007bff",
                                textDecoration: "underline",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <HugeiconsIcon icon={LinkSquare01Icon} size="1.2rem" style={{marginLeft: "5px"}}/>
                        </Link>
                    </>
                );
            },
            sortable: false,
        },
        {
            name: "Review",
            cell: row => {
                const count = row.reviews?.length || 0;
                return (
                    <>
                        {count}
                        <Link
                            to={`/user-management/${row.userid}/reviews`}
                            state={{username: row.username}}
                            style={{
                                color: "#007bff",
                                textDecoration: "underline",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <HugeiconsIcon icon={LinkSquare01Icon} size="1.2rem" style={{marginLeft: "5px"}}/>
                        </Link>
                    </>
                );
            },
            sortable: false,
        },
        {
            name: "Actions",
            selector: row => (
                <div className="table-action-buttons">
                    <button
                        className="table-edit-btn"
                        onClick={() => {
                            setEditingUser(row)
                            setShowEditModal(true)
                        }}>
                        <HugeiconsIcon icon={PencilEdit02Icon}/>
                    </button>
                    <button
                        className="table-delete-btn"
                        onClick={() => {
                            setSelectedUser(row)
                            setShowDeleteModal(true)
                        }}>
                        <HugeiconsIcon icon={Delete02Icon}/>
                    </button>
                </div>
            ),
            sortable: false,
        }
    ];

    //Table styles
    const customStyles = getCustomTableStyles(theme);

    return (
        <>
            <div className="admin-list-title">
                {title}
            </div>

            <div className="table-container">

                <div className="table-controls">
                    <div className="table-controls-rows">
                        {/*<label>Show</label>*/}
                        <select value={rowsPerPage} onChange={handleRowsChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={users.length}>All</option>
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
                            placeholder="Search Users..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={currentUsers}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    responsive
                    striped
                    highlightOnHover
                    progressPending={Loading}
                />

                {showEditModal && (
                    <EditUserModal
                        user={editingUser}
                        onClose={() => setShowEditModal(false)}
                        onSave={(updatedUser) => {
                            setUsers(prev =>
                                prev.map(u => (u.userid === updatedUser.userid ? updatedUser : u))
                            );
                        }}
                    />
                )}

                {showDeleteModal && <ConfirmationModal
                    message={`User ${selectedUser?.username} will be deleted.`}
                    action={"Delete"}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => {
                        if (!selectedUser) return;
                        axios.delete(`http://localhost:8080/admin/user/delete/${selectedUser.userid}`, {withCredentials: true})
                            .then(() => {
                                setUsers(prev => prev.filter(user => user.userid !== selectedUser.userid));
                                setShowDeleteModal(false);
                            })
                            .catch(error => {
                                console.error("Failed to delete user:", error);
                                setShowDeleteModal(false);
                            });
                    }}
                />}

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

export default UserTable;