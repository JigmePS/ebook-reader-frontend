import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../../Shared/Context/AuthContext.jsx";
import { useState } from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";
// import "../../CSS/Modal.css";

function EditEmailModal({ currentEmail, onClose }) {
    const { refreshSession } = useAuth();
    const [serverError, setServerError] = useState("");

    // Yup validation schema
    const schema = yup.object().shape({
        currentPassword: yup.string().required("Current password is required"),
        email: yup
            .string()
            .email("Invalid email format")
            .required("New email is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: currentEmail || "",
            currentPassword: ""
        }
    });

    const onSubmit = (data) => {
        setServerError("");

        fetch("http://localhost:8080/user/update-email", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ newEmail: data.email, currentPassword: data.currentPassword }),
        })
            .then((res) => {
                if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
                return res.text();
            })
            .then(() => {
                refreshSession();
                onClose();
            })
            .catch((err) => setServerError(err.message));
    };

    return (
        <div className="user-setting-modal-background">
            <div className="user-setting-modal">
                <div className="user-setting-modal-close-btn-container">
                    <button
                        className="user-setting-modal-close-btn"
                        type="button" onClick={onClose}>
                        <HugeiconsIcon icon={Cancel01Icon} size="1.7rem"/>
                    </button>
                </div>
                <div className="user-setting-modal-title-container">
                    <div className="user-setting-modal-title">
                        Edit Email
                    </div>
                </div>
                <form
                    className="user-setting-modal-form"
                    onSubmit={handleSubmit(onSubmit)}>
                    <label>Current Password</label>
                    <input
                        type="password"
                        {...register("currentPassword")}
                    />
                    <div className="form-error">{errors.currentPassword?.message}</div>

                    <label>New Email</label>
                    <input
                        type="email"
                        {...register("email")}
                    />
                    <div className="form-error">{errors.email?.message}</div>

                    {serverError && <p className="form-error">{serverError}</p>}

                    <div className="user-setting-modal-buttons">
                        <button
                            className="user-setting-modal-save-btn"
                            type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEmailModal;
