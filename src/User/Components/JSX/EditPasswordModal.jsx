import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";

function EditPasswordModal({ onClose }) {
    const [error, setError] = useState("");

    // Yup validation schema
    const schema = yup.object().shape({
        currentPassword: yup.string().required("Current password is required"),
        newPassword: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must be less than 20 characters")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .required("New password is required"),

        confirmPassword: yup
            .string()
            .oneOf([yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        const { currentPassword, newPassword } = data;
        setError(""); // Reset error before submitting

        fetch("http://localhost:8080/user/update-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ currentPassword, newPassword }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((msg) => {
                        throw new Error(msg);
                    });
                }
                return res.text();
            })
            .then(() => {
                toast.success("Password updated successfully");
                onClose();
            })
            .catch((err) => setError(err.message));
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
                        Edit Password
                    </div>
                </div>
                <form
                    className="user-setting-modal-form"
                    onSubmit={handleSubmit(onSubmit)}>
                    <label>Current Password</label>
                    <input
                        type="password"
                        {...register("currentPassword")}
                        required
                    />
                    {errors.currentPassword && (
                        <p className="form-error">{errors.currentPassword.message}</p>
                    )}

                    <label>New Password</label>
                    <input
                        type="password"
                        {...register("newPassword")}
                        required
                    />
                    {errors.newPassword && (
                        <p className="form-error">{errors.newPassword.message}</p>
                    )}

                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        required
                    />
                    {errors.confirmPassword && (
                        <p className="form-error">{errors.confirmPassword.message}</p>
                    )}

                    {error && <p className="form-error">{error}</p>}

                    <div className="user-setting-modal-buttons">
                        <button
                            className="user-setting-modal-save-btn"
                            type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPasswordModal;
