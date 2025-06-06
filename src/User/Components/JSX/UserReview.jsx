import "../CSS/Profile.css";
import {useEffect, useState, useRef, useCallback} from "react";
import ConfirmationModal from "../../../Shared/Components/JSX/ConfirmationModal.jsx"
import {Rating} from 'react-simple-star-rating';
import {Link} from "react-router-dom";
import {HugeiconsIcon} from "@hugeicons/react";
import {Delete02Icon} from "@hugeicons/core-free-icons";

function UserReview() {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const loadMoreRef = useRef();
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const fetchReviews = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);
        fetch(`http://localhost:8080/user/reviewlist?page=${page}&size=5`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setReviews(prev => {
                    const existingIds = new Set(prev.map(r => r.reviewid));
                    const newUnique = data.content.filter(r => !existingIds.has(r.reviewid));
                    return [...prev, ...newUnique];
                });
                setHasMore(!data.last);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch reviews", err);
                setLoading(false);
            });
    }, [page, loading, hasMore]);

    useEffect(() => {
        if (hasMore) {
            fetchReviews();
        }
    }, [page, fetchReviews]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node) return;

        let didTrigger = false; // Add a flag to avoid multiple triggers

        const observerCallback = entries => {
            if (entries[0].isIntersecting && hasMore && !loading && !didTrigger) {
                didTrigger = true;
                setPage(prev => prev + 1);
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };

        const observerInstance = new IntersectionObserver(observerCallback, observerOptions);
        observerInstance.observe(node);

        return () => {
            observerInstance.disconnect();
        };
    }, [hasMore, loading]);

    const confirmDelete = () => {
        fetch(`http://localhost:8080/user/reviews/delete/${selectedReviewId}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                if (res.ok) {
                    setReviews(prev => prev.filter(r => r.reviewid !== selectedReviewId));
                    setShowModal(false);
                    setSelectedReviewId(null);
                } else {
                    throw new Error("Failed to delete");
                }
            })
            .catch(err => {
                console.error("Delete failed", err);
                alert("Failed to delete the review.");
                setShowModal(false);
            });
    };

    return (
        <div className="user-profile-reviews-content">
            <div className="user-profile-review-title">Your Reviews</div>

            {reviews.map((review) => (
                <div key={review.reviewid} className="user-profile-reviews">
                    <Link
                        to={`/book/${review.bookid}-${review.booktitle.replaceAll(" ", "-").toLowerCase()}`}
                        className="user-profile-review-book-cover-container">
                        <img
                            className="user-profile-review-book-cover"
                            src={review.bookcover ? `data:image/jpeg;base64,${review.bookcover}` : "/default-cover.png"}
                            alt="Cover"
                        />
                    </Link>
                    <div className="user-profile-review-info">
                        <div>
                            <Link
                                to={`/book/${review.bookid}-${review.booktitle.replaceAll(" ", "-").toLowerCase()}`}
                                className={"user-profile-review-book-title"}>
                                {review.booktitle}
                            </Link>
                            <div className="user-profile-review-rating">
                                <Rating
                                    initialValue={review.rating}
                                    readonly
                                    size={20}
                                    allowFraction
                                />
                            </div>
                            <div className="user-profile-review-date">Date: {review.reviewdate}</div>
                            <div className="user-profile-review-description">{review.reviewdescription}</div>
                        </div>
                        <div className="user-profile-review-delete-button-container">
                            <button
                                className="user-profile-review-delete-button"
                                onClick={() => {
                                    setSelectedReviewId(review.reviewid);
                                    setShowModal(true);
                                }}
                            >
                                <HugeiconsIcon icon={Delete02Icon}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {hasMore && <div ref={loadMoreRef} className="loading-more">Loading more...</div>}

            {showModal && (
                <ConfirmationModal
                    message="This review will be permanently deleted."
                    action="Delete"
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}

export default UserReview;
