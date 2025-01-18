// import { useRef, useState, useCallback } from "react";
// import ReactQuill from "react-quill";
// import { FaPaperPlane, FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
// import "react-quill/dist/quill.snow.css";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase";
// import axios from "axios";
// import Popup from "../components/modal/ErrorAndSuccesPopup";
// import { useNavigate } from "react-router-dom";

// export default function CreatePost() {
//   const navigate = useNavigate();
//   const [postTitle, setPostTitle] = useState("");
//   const [postContent, setPostContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [subcategory, setSubcategory] = useState("");
//   const [thumbnail, setThumbnail] = useState(null); // file , setFile()
//   const [imageUploadProgress, setImageUploadProgress] = useState(null);
//   const [imageUploadError, setImageUploadError] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isUploading, setIsUploading] = useState(false);
//   const [publishSuccess, setPublishSuccess] = useState("");
//   const [publishError, setPublishError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const quillRef = useRef(null);

//   const handleTitleChange = (e) => setPostTitle(e.target.value);
//   const handleContentChange = (value) => setPostContent(value);
//   const handleCategoryChange = (e) => setCategory(e.target.value);
//   const handleSubcategoryChange = (e) => setSubcategory(e.target.value);

//   const imageHandler = useCallback(() => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();

//     input.onchange = async () => {
//       const file = input.files[0];
//       if (file) {
//         setIsUploading(true);
//         const storage = getStorage(app);
//         const fileName = `images/${new Date().getTime()}-${file.name}`;
//         const storageRef = ref(storage, fileName);
//         const uploadTask = uploadBytesResumable(storageRef, file);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress =
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setImageUploadProgress(progress.toFixed(0));
//           },
//           (error) => {
//             console.error("Image upload failed:", error);
//             setImageUploadError("Image upload failed: " + error.message);
//             setIsUploading(false);
//           },
//           async () => {
//             try {
//               const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//               const editor = quillRef.current.getEditor();
//               const range = editor.getSelection();

//               editor.insertEmbed(range.index, "image", downloadURL);
//               editor.setSelection(range.index + 1);

//               setIsUploading(false);
//               setImageUploadProgress(null);
//               setImageUploadError(null);
//             } catch (error) {
//               console.error("Error inserting image:", error);
//               setImageUploadError("Error inserting image: " + error.message);
//               setIsUploading(false);
//             }
//           }
//         );
//       }
//     };
//   }, []);

//   const modules = {
//     toolbar: {
//       container: [
//         [{ header: [1, 2, false] }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link", "image"],
//         ["clean"],
//       ],
//       handlers: {
//         image: imageHandler,
//       },
//     },
//   };

//   const handleThumbnailChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnail(URL.createObjectURL(file));
//       uploadThumbnail(file);
//     }
//   };

//   const uploadThumbnail = (file) => {
//     const storage = getStorage(app);
//     const fileName = `thumbnails/${new Date().getTime()}-${file.name}`;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setImageUploadProgress(progress.toFixed(0));
//       },
//       (error) => {
//         setImageUploadError("Thumbnail upload failed: " + error.message);
//         setImageUploadProgress(null);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setImageUploadProgress(null);
//           setImageUploadError(null);
//           setFormData({ ...formData, image: downloadURL });
//         });
//       }
//     );
//   };

//   const removeThumbnail = () => {
//     setThumbnail(null);
//     setImageUploadError("");
//     setImageUploadProgress(null);
//     setFormData({ ...formData, thumbnail: null });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedFormData = {
//       title: postTitle,
//       category: category,
//       subCategory: subcategory,
//       content: postContent,
//       ...formData,
//     };

//     try {
//       setLoading(true);
//       const res = await axios.post("/api/post/create", updatedFormData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (res) {
//         setPublishError(null);
//         setPublishSuccess("Post created successfully.");

//         // Empty the input fields
//         setPostTitle("");
//         setThumbnail(null);
//         setCategory("");
//         setSubcategory("");
//         setPostContent("");

//         navigate(`/post/${res?.data?.slug}/${res?.data?._id}`);
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setPublishError(error.response.data.message);
//       } else {
//         setPublishError("Something went wrong");
//       }
//       console.log(publishError);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center mt-20 bg-gradient-to-b from-purple-50 to-white p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-3xl bg-purple-100 shadow-lg rounded-lg p-8 mt-12"
//       >
//         <h2 className="text-3xl font-bold text-center mb-8">Create New Post</h2>

//         <div className="mb-6">
//           <label htmlFor="postTitle" className="block text-lg font-medium mb-2">
//             Post Title
//           </label>
//           <input
//             type="text"
//             id="postTitle"
//             value={postTitle}
//             onChange={handleTitleChange}
//             className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 placeholder-purple-400"
//             placeholder="Enter your post title..."
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-lg font-medium mb-2">Thumbnail</label>
//           <div className="relative w-full h-64 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
//             {thumbnail ? (
//               <>
//                 <img
//                   src={thumbnail}
//                   alt="Thumbnail"
//                   className="w-full h-full object-cover"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeThumbnail}
//                   className="absolute top-2 right-2 bg-white p-1 rounded-full text-purple-600"
//                 >
//                   <FaTimes />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <FaPlus className="text-purple-300 text-4xl" />
//                 <span className="ml-2 text-purple-400">Add a thumbnail</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleThumbnailChange}
//                   className="absolute inset-0 opacity-0 cursor-pointer"
//                 />
//               </>
//             )}
//           </div>
//         </div>

//         <div className="mb-6 grid grid-cols-2 gap-4">
//           <div>
//             <label
//               htmlFor="category"
//               className="block text-lg font-medium mb-2"
//             >
//               Category
//             </label>
//             <select
//               id="category"
//               value={category}
//               onChange={handleCategoryChange}
//               className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900"
//               required
//             >
//               <option value="">Select a category</option>
//               <option value="technology">Technology</option>
//               <option value="lifestyle">Lifestyle</option>
//               <option value="health">Health</option>
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor="subcategory"
//               className="block text-lg font-medium mb-2"
//             >
//               Subcategory
//             </label>
//             <select
//               id="subcategory"
//               value={subcategory}
//               onChange={handleSubcategoryChange}
//               className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900"
//               required
//             >
//               <option value="">Select a subcategory</option>
//               {category === "technology" && (
//                 <>
//                   <option value="software">Software</option>
//                   <option value="hardware">Hardware</option>
//                 </>
//               )}
//               {category === "lifestyle" && (
//                 <>
//                   <option value="mindset">Mindset</option>
//                   <option value="travel">Travel</option>
//                   <option value="food">Food</option>
//                 </>
//               )}
//               {category === "health" && (
//                 <>
//                   <option value="fitness">Fitness</option>
//                   <option value="nutrition">Nutrition</option>
//                 </>
//               )}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="postContent"
//             className="block text-lg font-medium mb-2"
//           >
//             Post Content
//           </label>
//           <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg  h-72 relative mb-6">
//             {isUploading && (
//               <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
//                 <FaSpinner className="animate-spin text-4xl text-purple-600" />
//               </div>
//             )}
//             <ReactQuill
//               ref={quillRef}
//               theme="snow"
//               value={postContent}
//               onChange={handleContentChange}
//               modules={modules}
//               placeholder="Write something amazing..."
//               className="h-60 rounded-xl"
//             />
//           </div>
//         </div>

//         {imageUploadProgress && (
//           <div className="w-full flex justify-center">
//             <div className="my-2">Uploading: {imageUploadProgress}%</div>
//           </div>
//         )}

//         {imageUploadError && (
//           <Popup
//             message={imageUploadError}
//             type="error"
//             onClose={() => setImageUploadError(null)}
//           />
//         )}
//         {/* {imageUploadError && (
//           <div className="mt-2 text-red-500">{imageUploadError}</div>
//         )} */}

//         <div className="text-center">
//           <button
//             type="submit"
//             className="flex items-center justify-center w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition duration-300 space-x-2"
//           >
//             <FaPaperPlane className="text-lg" />
//             <span>{loading ? "Publishing" : "Publish Post"}</span>
//           </button>
//         </div>
//       </form>
//       {publishSuccess && (
//         <Popup
//           message={publishSuccess}
//           type="success"
//           onClose={() => setPublishSuccess(null)}
//         />
//       )}
//       {publishError && (
//         <Popup
//           message={publishError}
//           type="error"
//           onClose={() => setPublishError(null)}
//         />
//       )}
//     </div>
//   );
// }

// New Approach with Error Validations
import { useRef, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import { FaPaperPlane, FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import Popup from "../components/modal/ErrorAndSuccesPopup";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be 150 characters or less"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Subcategory is required"),
  content: z
    .string()
    .min(3500, "Minimum 3500 characters are required")
    .max(10000, "Content cannot be more than 10000 characters"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState("");
  const [publishError, setPublishError] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      content: "",
      thumbnail: "",
    },
  });

  const selectedCategory = watch("category");

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setIsUploading(true);
        const storage = getStorage(app);
        const fileName = `images/${new Date().getTime()}-${file.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(progress.toFixed(0));
          },
          (error) => {
            console.error("Image upload failed:", error);
            setImageUploadError("Image upload failed: " + error.message);
            setIsUploading(false);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();

              editor.insertEmbed(range.index, "image", downloadURL);
              editor.setSelection(range.index + 1);

              setIsUploading(false);
              setImageUploadProgress(null);
              setImageUploadError(null);
            } catch (error) {
              console.error("Error inserting image:", error);
              setImageUploadError("Error inserting image: " + error.message);
              setIsUploading(false);
            }
          }
        );
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
      uploadThumbnail(file);
    }
  };

  const uploadThumbnail = (file) => {
    const storage = getStorage(app);
    const fileName = `thumbnails/${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Thumbnail upload failed: " + error.message);
        setImageUploadProgress(null);
        setValue("thumbnail", ""); // Clear form value on error
        setThumbnail(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUploadProgress(null);
          setImageUploadError(null);
          setValue("thumbnail", downloadURL); // Update form with actual URL
          setThumbnail(downloadURL);
          clearErrors("thumbnail"); // Clear validation error, if any
        } catch (error) {
          setImageUploadError("Failed to get download URL: " + error.message);
        }
      }
    );
  };

  const removeThumbnail = () => {
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail);
    }
    setThumbnail(null);
    setValue("thumbnail", "");
    setImageUploadError("");
    setImageUploadProgress(null);
  };

  const onSubmit = async (data) => {
    if (!thumbnail) {
      setPublishError("Thumbnail is required.");
      return;
    }
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/post/create`,
        { ...data, image: thumbnail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        setPublishError(null);
        setPublishSuccess("Post created successfully.");

        setTimeout(() => {
          navigate(`/post/${res?.data?.slug}/${res?.data?._id}`);
        }, 2000);

        // navigate(`/post/${res?.data?.slug}/${res?.data?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setPublishError(error.response.data.message);
      } else {
        setPublishError("Something went wrong");
      }
      console.log(publishError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center mt-16 bg-gradient-to-b from-purple-50 to-white p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-purple-100 shadow-lg rounded-lg p-4 mt-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Bring Ideas to Life</h2>

        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Blog Title <span className="text-red-600">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 placeholder-purple-400"
                placeholder="Enter your post title..."
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">
            Thumbnail <span className="text-red-600">*</span>
          </label>
          <div className="relative w-full h-64 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
            {thumbnail ? (
              <>
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full text-purple-600"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <FaPlus className="text-purple-300 text-4xl" />
                <span className="ml-2 text-purple-400">Add a thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
          {errors.thumbnail && (
            <p className="text-red-500 mt-1">{errors.thumbnail.message}</p>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-lg font-medium mb-2"
            >
              Category <span className="text-red-600">*</span>
            </label>
            <Controller
              id="category"
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900"
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="health">Health</option>
                </select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="subcategory"
              className="block text-lg font-medium mb-2"
            >
              Subcategory <span className="text-red-600">*</span>
            </label>
            <Controller
              id="subCategory"
              name="subCategory"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900"
                >
                  <option value="">Select a subcategory</option>
                  {selectedCategory === "technology" && (
                    <>
                      <option value="software">Software</option>
                      <option value="hardware">Hardware</option>
                    </>
                  )}
                  {selectedCategory === "lifestyle" && (
                    <>
                      <option value="mindset">Mindset</option>
                      <option value="travel">Travel</option>
                      <option value="food">Food</option>
                    </>
                  )}
                  {selectedCategory === "health" && (
                    <>
                      <option value="fitness">Fitness</option>
                      <option value="nutrition">Nutrition</option>
                    </>
                  )}
                </select>
              )}
            />
            {errors.subCategory && (
              <p className="text-red-500 mt-1">{errors.subCategory.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-lg font-medium mb-2">
            Content <span className="text-red-600">*</span>
          </label>
          <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg h-72 relative mb-6">
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                <FaSpinner className="animate-spin text-4xl text-purple-600" />
              </div>
            )}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  ref={quillRef}
                  modules={modules}
                  className="bg-white h-56 md:h-60"
                  placeholder="Write your post content here..."
                  onChange={(value) => {
                    setValue("content", value, { shouldValidate: true });
                  }}
                  onBlur={() => {
                    const sanitizedValue = watch("content")
                      .replace(/<[^>]*>?/gm, "")
                      .trim();
                    if (!sanitizedValue) {
                      setValue("content", "", { shouldValidate: true });
                    }
                  }}
                />
              )}
            />
          </div>
          {errors.content && (
            <p className="text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        {imageUploadProgress && (
          <div className="w-full flex justify-center">
            <div className="my-2">Uploading: {imageUploadProgress}%</div>
          </div>
        )}

        {imageUploadError && (
          <Popup
            message={imageUploadError}
            type="error"
            onClose={() => setImageUploadError(null)}
          />
        )}

        <div className="text-center">
          <button
            type="submit"
            className="flex items-center justify-center w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition duration-300 space-x-2"
            disabled={loading}
          >
            <FaPaperPlane className="text-lg" />
            <span>{loading ? "Publishing" : "Publish Post"}</span>
          </button>
        </div>
      </form>
      {publishSuccess && (
        <Popup
          message={publishSuccess}
          type="success"
          onClose={() => setPublishSuccess(null)}
        />
      )}
      {publishError && (
        <Popup
          message={publishError}
          type="error"
          onClose={() => setPublishError(null)}
        />
      )}
    </div>
  );
}
