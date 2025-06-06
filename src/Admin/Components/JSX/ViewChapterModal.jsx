import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";

function ViewChapterModal({ chapterId, chapterNumber, chapterName, onClose }) {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) onClose();
    };

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/admin/chapter/text/${chapterId}`, {
            withCredentials: true
        })
            .then(res => {
                setText(res.data.text || "No text content available.");
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch chapter text", err);
                const msg = err.response?.data?.message || "Failed to load chapter content.";
                setError(msg);
                setLoading(false);
            });
    }, [chapterId]);

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
                        Chapter {chapterNumber}: {chapterName}
                    </div>
                </div>

                <div className="admin-modal-body">
                    {loading && <p>Loading...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="chapter-text-content">
                            {text.split("\n").map((para, index) => (
                                <p key={index} style={{ marginBottom: "0.5rem" }}>{para}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewChapterModal;