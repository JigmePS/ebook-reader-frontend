import "../CSS/LoginSignupModal.css";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faEnvelope, faLock, faLockOpen} from "@fortawesome/free-solid-svg-icons";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

function SignupModal({onClose, onOpen}) {

    const handleSwitchToLogin = () => {
        onClose(); // Close Signup modal
        onOpen();  // Open Login modal
    };

    const modalRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    const [signupError, setSignupError] = useState("");

    const schema = yup.object().shape({
        username: yup.string()
            .max(20, "Username must be less than 20 characters")
            .required("Username is required"),

        email: yup.string()
            .email("Invalid email format")
            .required("Email is required"),

        password: yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must be less than 20 characters")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .required("Password is required"),

        confirmPassword: yup.string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        const { username, email, password } = data;
        const user = { username, email, password };

        try {
            const response = await axios.post("http://localhost:8080/user/register", user, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            toast.success("User registered successfully");
            console.log("User registered:", response.data);
            onClose(); // Close signup modal
            onOpen();  // Open login modal
        } catch (error) {
            console.error("Signup failed:", error.response?.data || error.message);
            setSignupError(error.response?.data || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="login-signup-modal-background" ref={modalRef} onClick={closeModal}>
            <div className="login-signup-modal-container">
                <div className="login-signup-modal-content">
                    <div className="login-signup-modal-form-title">Sign Up</div>
                    <div className="login-signup-modal-form">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="field-container">
                                <div className="field-content">
                                    <div className="field-icon">
                                        <FontAwesomeIcon icon={faUser} className="icon"/>
                                    </div>
                                    <input
                                        {...register("username")}
                                        type="text"
                                        placeholder="Username"
                                        className="field"/>
                                </div>
                                <div className="form-error">{errors.username?.message}</div>
                            </div>

                            <div className="field-container">
                                <div className="field-content">
                                    <div className="field-icon">
                                        <FontAwesomeIcon icon={faEnvelope} className="icon"/>
                                    </div>
                                    <input
                                        {...register("email")}
                                        type="text"
                                        placeholder="Email Address"
                                        className="field"/>
                                </div>
                                <div className="form-error">{errors.email?.message}</div>
                            </div>

                            <div className="field-container">
                                <div className="field-content">
                                    <div className="field-icon">
                                        <FontAwesomeIcon icon={faLockOpen} className="icon"/>
                                    </div>
                                    <input
                                        {...register("password")}
                                        type="password"
                                        placeholder="Password"
                                        className="field"/>
                                </div>
                                <div className="form-error">{errors.password?.message}</div>
                            </div>

                            <div className="field-container">
                                <div className="field-content">
                                    <div className="field-icon">
                                        <FontAwesomeIcon icon={faLock} className="icon"/>
                                    </div>
                                    <input
                                        {...register("confirmPassword")}
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="field"/>
                                </div>
                                <div className="form-error">{errors.confirmPassword?.message}</div>
                            </div>

                            {signupError && <div className="form-error">{signupError}</div>}

                            <input type="submit" value="Sign Up" className="submit-button"/>
                        </form>
                    </div>
                    <div className="form-switch">
                        Already have an account?
                        <button onClick={handleSwitchToLogin}>
                            Login now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupModal;