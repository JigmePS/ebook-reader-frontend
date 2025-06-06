import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import "../CSS/UserSettingModal.css";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";

function EditUsernameModal({currentUsername, onClose}) {
    const {refreshSession} = useAuth();
    const [serverError, setServerError] = useState("");

    const schema = yup.object().shape({
        username: yup
            .string()
            .max(20, "Username must be less than 20 characters")
            .required("Username is required")
    });

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: currentUsername || ""
        }
    });

    const onSubmit = (data) => {
        setServerError(""); // reset any previous server error

        fetch("http://localhost:8080/user/update-username", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({newUsername: data.username}),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then(msg => {
                        throw new Error(msg);
                    });
                }
                return res.text();
            })
            .then(() => {
                refreshSession();
                onClose();
            })
            .catch((err) => {
                setServerError(err.message);
            });
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
                        Edit Username
                    </div>
                </div>
                <form
                    className="user-setting-modal-form"
                    onSubmit={handleSubmit(onSubmit)}>
                    <label>New Username</label>
                    <input
                        type="text"
                        {...register("username")}
                    />
                    <div className="form-error">{errors.username?.message}</div>

                    {serverError && <div className="form-error">{serverError}</div>}

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

export default EditUsernameModal;
