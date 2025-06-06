import React, {useEffect, useState} from 'react';
import {Rating} from 'react-simple-star-rating';
import axios from "axios";
import "../CSS/Review.css";
import {useReview} from "../../Context/ReviewContext.jsx"
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Delete02Icon, Edit03Icon} from "@hugeicons/core-free-icons";

function BookReview({bookId}) {
    const {userReviews, fetchUserReviews} = useReview();

    const {sessionData} = useAuth();
    const [otherReviews, setOtherReviews] = useState([]);

    //All reviews excluding user if logged in
    useEffect(() => {
        const fetchOtherReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/book/${bookId}/reviews`, {
                    withCredentials: true
                });
                setOtherReviews(response.data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };

        fetchOtherReviews();
    }, [bookId, sessionData]);

    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRating = (rate) => {
        setRating(rate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8080/user/reviews/add', null, {
                params: {
                    bookId,
                    rating,
                    reviewDescription: description,
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setSuccess('Review submitted successfully!');
                setRating(0);
                setDescription('');
                fetchUserReviews(); // Refresh context
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                'Failed to submit review. You might have already submitted one.'
            );
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(0);
    const [editDescription, setEditDescription] = useState('');

    const handleEdit = () => {
        setEditRating(existingReview.rating);
        setEditDescription(existingReview.reviewdescription || '');
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.put(`http://localhost:8080/user/reviews/update`, null, {
                params: {
                    bookId,
                    rating: editRating,
                    reviewDescription: editDescription,
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                setSuccess('Review updated successfully!');
                setIsEditing(false);
                fetchUserReviews();
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update review.');
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const handleDeleteClick = () => {
        if (existingReview) {
            setSelectedReviewId(existingReview.reviewid);
            setShowModal(true);
        }
    };

    const handleDeleteReview = async () => {
        try {
            await axios.delete(`http://localhost:8080/user/reviews/delete/${selectedReviewId}`, {
                withCredentials: true,
            });
            setShowModal(false);
            fetchUserReviews(); // Refresh review list
        } catch (err) {
            console.error("Failed to delete review", err);
        }
    };

    const existingReview = userReviews.find((review) => review.bookid === bookId);

    return (
        <>
            <div className="book-info-section-title">Review</div>
            <div className="book-info-section-content">
                {sessionData && (
                    <>
                        {!existingReview ? (
                            <div className="book-review-form-container">
                                <div className="book-review-form-title">Write a Review</div>
                                <form className="book-review-form" onSubmit={handleSubmit}>
                                    <div className="rating-stars">
                                        <Rating
                                            onClick={handleRating}
                                            ratingValue={rating * 20}
                                            size={30}
                                            label
                                            transition
                                            fillColor="#ffd700"
                                            emptyColor="#ccc"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Write your review (optional)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="book-review-description"
                                    />
                                    <button
                                        type="submit"
                                        className="submit-review-btn"
                                        disabled={rating === 0}
                                    >
                                        Submit Review
                                    </button>
                                </form>
                                {error && <p style={{color: 'red'}}>{error}</p>}
                                {success && <p style={{color: 'green'}}>{success}</p>}
                            </div>
                        ) : (
                            <div className="book-user-review-container">
                                <div className="book-user-review-heading">
                                    <div className="book-user-review-title">Your Review</div>
                                    <div className="book-user-review-action">
                                        {!isEditing ? (
                                            <>
                                                <button
                                                    className="book-user-review-action-btn user-review-edit-btn"
                                                    onClick={handleEdit}>
                                                    <HugeiconsIcon icon={Edit03Icon}/>
                                                </button>
                                                <button
                                                    className="book-user-review-action-btn user-review-delete-btn"
                                                    onClick={handleDeleteClick}>
                                                    <HugeiconsIcon icon={Delete02Icon}/>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="review-edit-save-btn"
                                                    onClick={handleUpdate}>
                                                    Save
                                                </button>
                                                <button
                                                    className="review-edit-cancel-btn"
                                                    onClick={() => setIsEditing(false)}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="book-user-review">
                                    <div className="book-user">
                                        <div className="book-user-image-container">
                                            {existingReview.user.picture ? (
                                                <img
                                                    className="book-user-image"
                                                    src={`data:image/jpeg;base64,${existingReview.user.picture}`}
                                                    alt="User"
                                                />
                                            ) : (
                                                <div className="book-user-fallback">
                                                    {existingReview.user.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="book-user-review-content">
                                            <div className="book-user-name">{existingReview.user.username}</div>

                                            <div className="book-user-review-rating">
                                                {!isEditing ? (
                                                    <Rating
                                                        readonly
                                                        initialValue={existingReview.rating}
                                                        size={20}
                                                        fillColor="#ffd700"
                                                        emptyColor="#ccc"
                                                    />
                                                ) : (
                                                    <Rating
                                                        onClick={(rate) => setEditRating(rate)}
                                                        ratingValue={editRating * 20}
                                                        size={30}
                                                        fillColor="#ffd700"
                                                        emptyColor="#ccc"
                                                    />
                                                )}
                                            </div>

                                            <div className="book-user-review-description">
                                                {!isEditing ? (
                                                    existingReview.reviewdescription || "No description"
                                                ) : (
                                                    <textarea
                                                        rows={4}
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        className="book-review-description"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {showModal && (
                                        <ConfirmationModal
                                            message="This review will be permanently deleted."
                                            action="Delete"
                                            onClose={() => setShowModal(false)}
                                            onConfirm={handleDeleteReview}
                                        />
                                    )}
                                </div>

                                {error && <p style={{color: 'red'}}>{error}</p>}
                                {success && <p style={{color: 'green'}}>{success}</p>}
                            </div>
                        )}
                    </>
                )}
                <div className="book-review-list-container">
                    {otherReviews.length === 0 ? (
                        <div>No reviews.</div>
                    ) : (
                        otherReviews.map((review) => (
                            <div key={review.reviewid} className="book-review-item">
                                <div className="book-user">
                                    <div className="book-user-image-container">
                                        {review.user.picture ? (
                                            <img
                                                className="book-user-image"
                                                src={`data:image/jpeg;base64,${review.user.picture}`}
                                                alt="User"
                                            />
                                        ) : (
                                            <div className="book-user-fallback">
                                                {review.user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="book-user-review-content">
                                        <div className="book-user-name">{review.user.username}</div>
                                        <div className="book-user-review-rating">
                                            <Rating
                                                readonly
                                                initialValue={review.rating}
                                                size={20}
                                                fillColor="#ffd700"
                                                emptyColor="#ccc"
                                            />
                                        </div>
                                        <div className="book-user-review-description">
                                            {review.reviewdescription || ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default BookReview;
