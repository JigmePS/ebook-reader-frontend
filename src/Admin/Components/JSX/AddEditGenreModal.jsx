import {useState, useEffect, useRef} from "react";
import axios from "axios";
import "../CSS/AddEditViewModal.css";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";
import {toast} from "react-toastify";

function AddEditGenreModal({genre, onClose, onSave}) {

    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    const [name, setName] = useState("");

    useEffect(() => {
        if (genre) {
            setName(genre.genrename);
        } else {
            setName("");
        }
    }, [genre]);

    const handleSave = () => {
        if (!name.trim()) {
            toast.error("Genre name cannot be empty");
            return;
        }

        const payload = {genrename: name.trim()};
        const request = genre
            ? axios.put(`http://localhost:8080/admin/genre/update/${genre.genreid}`, payload, {
                withCredentials: true,
            })
            : axios.post("http://localhost:8080/admin/genre/add", payload, {
                withCredentials: true,
            });

        request
            .then((res) => {
                toast.success(`Genre ${genre ? "updated" : "added"} successfully!`);
                onSave(res.data);
                onClose();
            })
            .catch((err) => {
                console.error("Error saving genre", err);
                toast.error("Failed to save genre. Please try again.");
            });
    };

    return (
        <div className="add-edit-view-modal-container" ref={modalRef} onClick={closeModal}>
            <div className="add-edit-view-modal-content">
                <div className="add-edit-view-modal-close-btn-container">
                    <button className="add-edit-view-modal-close-btn" onClick={onClose}>
                        <HugeiconsIcon icon={Cancel01Icon} size="1.5rem"/>
                    </button>
                </div>
                <div className="admin-modal-title-container">
                    <div className="admin-modal-title">
                        {genre ? "Edit Genre" : "Add Genre"}
                    </div>
                </div>

                <div className="admin-modal-form">
                    <label>Genre Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter genre name"
                    />
                    <div className="admin-modal-actions">
                        <button
                            className="admin-modal-save-btn"
                            onClick={handleSave}>
                            {genre ? "Save" : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEditGenreModal;