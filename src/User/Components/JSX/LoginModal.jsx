import "../CSS/LoginSignupModal.css"
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {useCart} from "../../Context/CartContext.jsx";
import {useLibrary} from "../../Context/LibraryContext.jsx";
import ForgotPasswordModal from "./ForgotPasswordModal.jsx";
import {usePicture} from "../../Context/PictureContext.jsx";

function LoginModal({onClose,onOpen}) {

    const handleSwitchToSignup = () => {
        onClose(); // Close login modal
        onOpen();  // Open signup modal
    };

    const {fetchUserPicture} = usePicture();
    const { refreshSession } = useAuth();
    const { fetchLibraryData } = useLibrary();
    const {fetchCartData} = useCart();

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

    const schema = yup.object().shape({
        email: yup.string()
            .email("Invalid email format")
            .required("Email is required"),

        password: yup.string()
            .required("Password is required"),
    })

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoginError("");  // Clear previous errors on new submission
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/user/login', data, {
                withCredentials: true,
            });

            console.log("Login response:", response.data);

            onClose(); // Close modal FIRST

            if (response.data.role?.toUpperCase() === "ADMIN") {
                console.log("Redirecting to admin dashboard...");
                navigate("/admin-dashboard");
            } else {
                navigate("/"); // default user route
            }

            // Await these to ensure data is loaded after login
            await refreshSession();
            await fetchUserPicture();
            await fetchCartData();

        } catch (err) {
            console.error("Login failed", err);
            setLoginError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const [showForgotModal, setShowForgotModal] = useState(false);

    return (
        <div className="login-signup-modal-background" ref={modalRef} onClick={closeModal}>
            <div className="login-signup-modal-container">
                <div className="login-signup-modal-content">
                    <div className="login-signup-modal-form-title">
                        Log In
                    </div>
                    <div className="login-signup-modal-form">
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                <div className="form-error" aria-live="assertive">{errors.email?.message}</div>
                            </div>
                            <div className="field-container">
                                <div className="field-content">
                                    <div className="field-icon">
                                        <FontAwesomeIcon icon={faLock} className="icon"/>
                                    </div>
                                    <input
                                        {...register("password")}
                                        type="password"
                                        placeholder="Password"
                                        className="field"/>
                                </div>
                                <div className="form-error" aria-live="assertive">{errors.password?.message}</div>
                                <div className="forget-password-redirect">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}>Forgot password?</button>
                                </div>
                            </div>

                            {loginError && <div className="form-error" aria-live="assertive">{loginError}</div>}

                            <input
                                type="submit"
                                value={loading ? "Logging in..." : "Login"}
                                className="submit-button"
                                disabled={loading}
                            />
                            {loading && <span style={{marginLeft: "10px"}}>Loading...</span>}
                        </form>
                    </div>
                    <div className="form-switch">
                        New to Biblio?
                        <button onClick={handleSwitchToSignup} disabled={loading}>
                            Signup now
                        </button>
                    </div>
                </div>
            </div>
            {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
        </div>
    )
}

export default LoginModal;