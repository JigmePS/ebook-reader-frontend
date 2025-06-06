import BookListHeader from "../Components/JSX/BookListHeader.jsx";
import "../Background.css";
import { useEffect, useRef, useState, useCallback } from "react";
import SearchResults from "../Components/JSX/SearchResults.jsx";

function HighestRatedBooks() {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loadMoreRef = useRef();

    const fetchHighestRated = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        fetch(`http://localhost:8080/user/book/highest-rated-books?page=${page}&size=8`)
            .then(res => res.json())
            .then(data => {
                setResults(prev => {
                    const newBooks = data.content.filter(book => !prev.some(b => b.id === book.id));
                    return [...prev, ...newBooks];
                });
                setHasMore(!data.last);
                setLoading(false);
                console.log("Observer triggered. Page:", page);
            })
            .catch(err => {
                console.error("Failed to fetch highest-rated books", err);
                setLoading(false);
            });
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchHighestRated();
    }, [page, fetchHighestRated]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    console.log("Observer triggered. Page:", page);
                    setTimeout(() => {
                        setPage(prev => prev + 1);
                    }, 100); // Debounce to avoid multiple triggers
                }
            },
            {
                root: null,
                rootMargin: "0px 0px 300px 0px",
                threshold: 0.1,
            }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [loadMoreRef, page]);

    return (
        <>
            <BookListHeader title={"Highest Rated Books"} />
            <div className="booklist-main-content-background">
                <div className="booklist-main-content">
                    <SearchResults books={results} />
                    {hasMore && (
                        <div ref={loadMoreRef} className="loading-more">
                            Loading more...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default HighestRatedBooks;
