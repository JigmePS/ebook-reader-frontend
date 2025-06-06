import '../CSS/ConfirmationModal.css'
import {useEffect, useRef} from "react";

function ConfirmationModal({onClose, message, action, onConfirm}) {

    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div ref={modalRef} onClick={closeModal} className="confirm-form-container">
            <div className="confirm-form">
                <div className="confirm-form-heading">
                    Are you sure?
                </div>
                <div className="confirm-form-message">
                    {message}
                </div>
                <div className="confirm-form-action">
                    <div className="confirm-actn confirm-btn">
                        <button onClick={onConfirm}>{action}</button>
                    </div>
                    <div className="confirm-actn confirm-cancel-btn">
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal;