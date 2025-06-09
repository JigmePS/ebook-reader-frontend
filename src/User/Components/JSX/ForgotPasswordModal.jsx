import React, {useRef, useState} from 'react';
import axios from 'axios';
import OtpInput from 'react-otp-input';
import {toast} from "react-toastify";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

function ForgotPasswordModal({onClose}) {
    const [step, setStep] = useState(1);
    const [emailValue, setEmailValue] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    // Step 1: Email form schema
    const emailSchema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Email is required"),
    });

    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmail,
        formState: {errors: emailErrors}
    } = useForm({
        resolver: yupResolver(emailSchema),
    });

    const handleSendEmail = async (data) => {
        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/user/forgot/send-otp', {email: data.email});
            setEmailValue(data.email);
            setStep(2);
        } catch {
            setError("Email not found.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: New Password schema
    const passwordSchema = yup.object().shape({
        newPassword: yup.string()
            .required("Password is required")
            .min(8, "Must be at least 8 characters")
            .max(20, "Must be at most 20 characters")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character")
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: {errors: passwordErrors}
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/user/forgot/verify-otp', {email: emailValue, otp});
            setStep(3);
        } catch {
            setError("Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data) => {
        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/user/forgot/reset-password', {
                email: emailValue,
                otp,
                newPassword: data.newPassword
            });
            toast.success("Password reset successfully");
            onClose();
        } catch {
            setError("Reset failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-signup-modal-background" ref={modalRef} onClick={closeModal}>
            <div className="login-signup-modal-container">
                <div className="login-signup-modal-content">
                    <div className="login-signup-modal-form-title">Forgot Password</div>

                    {step === 1 && (
                        <>
                            <form onSubmit={handleSubmitEmail(handleSendEmail)} className="forgot-password-form">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...registerEmail("email")}
                                    disabled={loading}
                                />
                                <button type="submit" disabled={loading}>
                                    {loading ? "Sending..." : "Send OTP"}
                                </button>
                            </form>
                            <div className="form-error" aria-live="assertive">{emailErrors.email?.message}</div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="otp-form">
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                isDisabled={loading}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            margin: '0 0.3rem',
                                            fontSize: '1.25rem',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            textAlign: 'center',
                                        }}
                                    />
                                )}
                            />
                            <div>OTP will expire in 60 seconds.</div>
                            <button onClick={handleVerifyOtp} disabled={loading}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <>
                            <form onSubmit={handleSubmitPassword(handleResetPassword)} className="new-password-form">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    {...registerPassword("newPassword")}
                                    disabled={loading}
                                />
                                <div className="form-error" aria-live="assertive">{passwordErrors.newPassword?.message}</div>
                                <button type="submit" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        </>
                    )}

                    {error && <div className="form-error" aria-live="assertive">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordModal;
