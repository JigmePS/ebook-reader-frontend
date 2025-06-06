import React, {useState, useEffect} from "react";
import DataTable from "react-data-table-component";
import { getCustomTableStyles } from "../../../Shared/Theme/tableThemes.jsx";

import '../CSS/AdminTable.css'
import {HugeiconsIcon} from "@hugeicons/react";
import {
    AddSquareIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Search01Icon,
    SquareArrowExpand01Icon
} from "@hugeicons/core-free-icons";
import axios from "axios";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import AddEditGenreModal from "./AddEditGenreModal.jsx";
import {Tooltip} from "react-tooltip";
import ViewOrderModal from "../../../Shared/Components/JSX/ViewOrderModal.jsx";


function OrderTable({title, theme}) {

    //Get order list from the database
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/admin/order/all", {withCredentials: true})
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch orders", err);
                setLoading(false);
            });
    }, []);

    //View order modal
    const [viewOrder, setViewOrder] = useState(null);

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

    const filteredOrders = orders.filter(order => {
        const usernameMatch = order.username?.toLowerCase().includes(searchTerm);
        const itemsMatch = order.items?.some(item =>
            item.bookTitle?.toLowerCase().includes(searchTerm)
        );
        return usernameMatch || itemsMatch;
    });

    const indexOfLastOrders = currentPage * rowsPerPage;
    const indexOfFirstOrders = indexOfLastOrders - rowsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrders, indexOfLastOrders);
    const pageCount = Math.ceil(filteredOrders.length / rowsPerPage);

    //Table columns
    const columns = [
        {
            name: "Order ID",
            selector: row => row.orderId,
            sortable: true
        },
        {
            name: "Username",
            selector: row => row.username,
            sortable: true
        },
        {
            name: "Order Items",
            cell: row => {
                const text = row.items?.map(i => i.bookTitle).join(", ") || "None"; // ✅ bookTitle from DTO
                const tooltipId = `items-tooltip-${row.orderId}`;
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
                        <Tooltip id={tooltipId} place="top"/>
                    </>
                );
            },
            sortable: false
        },
        {
            name: "Total Price",
            selector: row => `$${row.totalAmount?.toFixed(2)}`, // ✅ totalAmount from DTO
            sortable: true
        },
        {
            name: "Order Date",
            selector: row => new Date(row.orderDate).toLocaleString(), // ✅ orderDate from DTO
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <button
                    className="table-view-btn"
                    onClick={() => setViewOrder(row)}>
                    <HugeiconsIcon icon={SquareArrowExpand01Icon}/>
                </button>
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
            </div>

            <div className="table-container">

                <div className="table-controls">
                    <div className="table-controls-rows">
                        {/*<label>Show</label>*/}
                        <select value={rowsPerPage} onChange={handleRowsChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={orders.length}>All</option>
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
                            placeholder="Search Orders..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={currentOrders}
                    customStyles={customStyles}
                    theme={theme === "dark" ? "darkMode" : "default"}
                    responsive
                    striped
                    highlightOnHover
                    progressPending={loading}
                />

                {viewOrder && (
                    <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)}/>
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

export default OrderTable;