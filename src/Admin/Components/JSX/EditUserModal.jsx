import {useEffect, useRef} from "react";
import axios from "axios";
import "../CSS/AddEditViewModal.css";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";

import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

function EditUserModal({user, onClose, onSave}) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    const schema = yup.object().shape({
        username: yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        setValue("username", user.username);
        setValue("email", user.email);
    }, [user, setValue]);

    const onSubmit = (data) => {
        axios
            .put(`http://localhost:8080/admin/user/update/${user.userid}`, {
                ...user,
                username: data.username,
                email: data.email,
            }, {withCredentials: true})
            .then((response) => {
                onSave(response.data);
                onClose();
            })
            .catch((error) => {
                console.error("Failed to update user:", error);
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
                        Edit User
                    </div>
                </div>

                <form
                    className="admin-modal-form"
                    onSubmit={handleSubmit(onSubmit)}>
                    <label>Username</label>
                    <input {...register("username")} />
                    <div className="form-error">{errors.username?.message}</div>

                    <label>Email</label>
                    <input {...register("email")} />
                    <div className="form-error">{errors.email?.message}</div>

                    <div className="admin-modal-actions">
                        <button
                            className="admin-modal-save-btn"
                            type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUserModal;