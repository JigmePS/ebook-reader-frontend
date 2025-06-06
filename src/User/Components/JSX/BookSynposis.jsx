function BookSynposis({ description }) {
    const formattedDescription = description
        ? description.replace(/\n/g, "<br />")
        : "No synopsis available.";

    return (
        <>
            <div className="book-info-section-title">Synopsis</div>
            <div
                className="book-info-section-content"
                dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
        </>
    );
}

export default BookSynposis;