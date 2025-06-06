import '../../Background.css'

function BookListHeader({title}) {
    return (
        <div className="booklist-content-background">
            <div className="booklist-content">
                {title}
            </div>
        </div>
    )
}

export default BookListHeader;