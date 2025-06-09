import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";
import {toast} from "react-toastify";

function AddEditBookModal({book, onClose, onSave}) {
    const isEditMode = !!book;

    const [genres, setGenres] = useState([]);
    const [preview, setPreview] = useState(
        book?.coverImage ? `data:image/jpeg;base64,${book.coverImage}` : null
    );
    const [selectedGenreToAdd, setSelectedGenreToAdd] = useState("");

    const schema = yup.object().shape({
        booktitle: yup.string().required("Title is required"),
        author: yup.string().required("Author is required"),
        price: yup
            .number()
            .typeError("Price must be a number")
            .positive("Price must be positive")
            .required("Price is required"),
        description: yup.string().required("Description is required"),
        genreIds: yup.array().min(1, "At least one genre must be selected"),
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            booktitle: book?.booktitle || "",
            author: book?.author || "",
            price: book?.price || "",
            description: book?.description || "",
            genreIds: book?.genres?.map(g => g.genreid) || [],
        }
    });

    const [coverFile, setCoverFile] = useState(null);

    const genreIds = watch("genreIds");

    useEffect(() => {
        axios.get("http://localhost:8080/admin/genre/all", {withCredentials: true})
            .then(res => setGenres(res.data))
            .catch(err => console.error("Failed to load genres", err));
    }, []);

    const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (form) => {
        const formData = new FormData();
        formData.append("booktitle", form.booktitle);
        formData.append("author", form.author);
        formData.append("price", form.price);
        formData.append("description", form.description);
        formData.append("genreIds", JSON.stringify(form.genreIds));
        if (coverFile) {
            formData.append("coverImage", coverFile);
        }

        const url = isEditMode
            ? `http://localhost:8080/admin/book/update/${book.bookid}`
            : "http://localhost:8080/admin/book/add";

        const method = isEditMode ? axios.put : axios.post;

        method(url, formData, {
            withCredentials: true,
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(res => {
                toast.success(`Book ${isEditMode ? "updated" : "added"} successfully!`);
                onSave(res.data);
            })
            .catch(err => {
                toast.error(`${isEditMode ? "Update" : "Create"} book failed`);
                console.error(`${isEditMode ? "Update" : "Create"} book failed`, err);
            })
            .finally(() => onClose());
    };

    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);

    axios.get("http://localhost:8080/admin/author/all", {withCredentials: true})
        .then(res => setAuthorSuggestions(res.data)) // assuming res.data is an array of author names
        .catch(err => console.error("Failed to load authors", err));

    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) onClose();
    };

    return (
        <div className="add-edit-view-modal-container" ref={modalRef} onClick={closeModal}>
            <div className="add-edit-view-modal-content">
                <div className="add-edit-view-modal-close-btn-container">
                    <button className="add-edit-view-modal-close-btn" onClick={onClose}>
                        <HugeiconsIcon icon={Cancel01Icon} size="1.5rem"/>
                    </button>
                </div>
                <div className="admin-modal-title-container">
                    <div className="admin-modal-title">
                        {isEditMode ? `Edit Book: ${book.booktitle}` : "Add New Book"}
                    </div>
                </div>

                <div className="admin-modal-big-form">

                    <div className="admin-modal-big-form-row">
                        <div className="admin-modal-big-form-row-unit">
                            <label>Title</label>
                            <input {...register("booktitle")} />
                            <div className="form-error">{errors.booktitle?.message}</div>
                        </div>
                    </div>

                    <div className="admin-modal-big-form-row">
                        <div className="admin-modal-big-form-row-unit">
                            <label>Author</label>
                            <div className="author-input-wrapper">
                                <input
                                    {...register("author")}
                                    onChange={(e) => {
                                        setValue("author", e.target.value);
                                        const input = e.target.value.toLowerCase();
                                        setFilteredAuthors(authorSuggestions.filter(a => a.toLowerCase().includes(input)));
                                        setShowAuthorSuggestions(true);
                                    }}
                                    onFocus={() => setShowAuthorSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowAuthorSuggestions(false), 150)} // timeout to allow click
                                />

                                {showAuthorSuggestions && filteredAuthors.length > 0 && (
                                    <ul className="author-suggestion-dropdown">
                                        {filteredAuthors.map((author, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setValue("author", author);
                                                    setShowAuthorSuggestions(false);
                                                }}
                                            >
                                                {author}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="form-error">{errors.author?.message}</div>
                        </div>


                        <div className="admin-modal-big-form-row-unit">
                            <label>Price (in $)</label>
                            <input type="number" step="0.01" {...register("price")} />
                            <div className="form-error">{errors.price?.message}</div>
                        </div>
                    </div>

                    <div className="admin-modal-big-form-row">
                        <div className="admin-modal-big-form-row-unit">
                            <label>Description</label>
                            <textarea rows={4} {...register("description")} />
                            <div className="form-error">{errors.description?.message}</div>
                        </div>
                    </div>

                    <div className="admin-modal-big-form-row">
                        <div className="admin-modal-big-form-row-unit">
                            <label>Add Genre</label>
                            <div className="admin-form-select-container">
                                <select
                                    value={selectedGenreToAdd}
                                    onChange={(e) => setSelectedGenreToAdd(e.target.value)}
                                >
                                    <option value="">-- Select Genre --</option>
                                    {genres
                                        .filter(genre => !genreIds.includes(genre.genreid))
                                        .map(genre => (
                                            <option key={genre.genreid} value={genre.genreid}>
                                                {genre.genrename}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedGenreToAdd) {
                                            const updated = [...genreIds, Number(selectedGenreToAdd)];
                                            setValue("genreIds", updated);
                                            setSelectedGenreToAdd("");
                                        }
                                    }}
                                >
                                    Add Genre
                                </button>
                                <div className="form-error">{errors.genreIds?.message}</div>
                            </div>

                            {genreIds.length > 0 && (
                                <div style={{marginTop: "5px"}}>
                                    <strong>Selected Genres:</strong>
                                    <ul className="admin-form-genre-list">
                                        {genreIds.map(id => {
                                            const genre = genres.find(g => g.genreid === id);
                                            return (
                                                <li key={id}>
                                                    {genre?.genrename || id}
                                                    <button
                                                        type="button"
                                                        style={{marginLeft: "10px"}}
                                                        onClick={() => {
                                                            const updated = genreIds.filter(gid => gid !== id);
                                                            setValue("genreIds", updated);
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="admin-modal-big-form-row">
                        <div className="admin-modal-big-form-row-unit">
                            <label>Cover Image</label>
                            <div className="admin-form-file-container">
                                <input type="file" accept="image/*" onChange={handleFileChange}/>
                                {preview && (
                                    <img src={preview} alt="Preview" style={{width: "100px", marginTop: "10px"}}/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-modal-actions">
                    <button
                        className="admin-modal-save-btn"
                        onClick={handleSubmit(onSubmit)}>Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddEditBookModal;