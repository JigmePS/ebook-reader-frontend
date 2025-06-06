import {useState, useEffect, useRef, useMemo} from "react";
import axios from "axios";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useAuth} from "../../../Shared/Context/AuthContext.jsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";
import {toast} from "react-toastify";

function AddEditChapterModal({chapter, bookId, onClose, onSave}) {

    const {refreshSession} = useAuth();

    const isEditMode = !!chapter;
    const modalRef = useRef();
    const [pdfFileName, setPdfFileName] = useState("");

    // ✅ Dynamic schema with conditional validation for pdfFile
    const schema = useMemo(() => {
        return yup.object().shape({
            chapternumber: yup
                .number()
                .typeError("Chapter number must be a number")
                .integer("Chapter number must be an integer")
                .min(1, "Chapter number must be at least 1")
                .required("Chapter number is required"),

            chaptername: yup
                .string()
                .trim()
                .required("Chapter name is required"),

            pdfFile: yup
                .mixed()
                .test("fileType", "Only PDF files are allowed", (value) => {
                    if (!value) return true;
                    return value.type === "application/pdf";
                })
                .test("requiredIfAdding", "PDF file is required", function (value) {
                    const isEdit = this.options.context?.isEditMode;
                    console.log("isEditMode in yup test", isEdit, "value:", value);
                    if (!isEdit && !value) {
                        return false;
                    }
                    return true;
                }),
        });
    }, [isEditMode]); // ✅ Must include this

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema, { context: { isEditMode } }),
        defaultValues: {
            chapternumber: chapter?.chapternumber || "",
            chaptername: chapter?.chaptername || "",
            pdfFile: null
        }
    });

    const pdfFile = watch("pdfFile");

    useEffect(() => {
        console.log("pdfFile watched:", pdfFile);
    }, [pdfFile]);


    useEffect(() => {
        if (chapter?.pdfPath) {
            const filename = chapter.pdfPath.split("/").pop();
            setPdfFileName(filename);
        }
    }, [chapter]);

    const closeModal = (e) => {
        if (e.target === modalRef.current) {
            onClose();
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("chapternumber", data.chapternumber);
        formData.append("chaptername", data.chaptername);
        if (data.pdfFile) {
            formData.append("pdfFile", data.pdfFile);
        }

        const url = isEditMode
            ? `http://localhost:8080/admin/chapter/update/${chapter.chapterid}`
            : `http://localhost:8080/admin/book/${bookId}/chapter/add`;

        const method = isEditMode ? axios.put : axios.post;

        method(url, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                refreshSession(); // ✅ Update session context
                toast.success(`Chapter ${isEditMode ? "updated" : "added"} successfully!`);
                onSave(res.data);
            })
            .catch(err => {
                console.error("Failed to save chapter", err);
                toast.error("Failed to save chapter. Please try again.");
            })
            .finally(() => onClose());
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("pdfFile", file, {shouldValidate: true});
            setPdfFileName(file.name);
        }
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
                        {isEditMode ? `Edit Chapter: ${chapter.chaptername}` : "Add New Chapter"}
                    </div>
                </div>

                <form
                    className="admin-modal-form"
                    onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <label>Chapter Number</label>
                    <input
                        type="number"
                        {...register("chapternumber")}
                        min={1}
                    />
                    <div className="form-error">{errors.chapternumber?.message}</div>

                    <label>Chapter Name</label>
                    <input
                        type="text"
                        {...register("chaptername")}
                    />
                    <div className="form-error">{errors.chaptername?.message}</div>

                    <label>PDF File</label>
                    <div className="admin-form-file-container">
                        <input type="file" accept="application/pdf" onChange={handleFileChange}/>
                        {pdfFileName && (
                            <p style={{marginTop: "10px"}}>Selected: {pdfFileName}</p>
                        )}
                        <div className="form-error">{errors.pdfFile?.message}</div>
                    </div>

                    <div className="admin-modal-actions">
                        <button
                            className="admin-modal-save-btn"
                            type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEditChapterModal;
