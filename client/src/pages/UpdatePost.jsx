// import { useRef, useState, useCallback, useEffect } from "react";
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
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Popup from "../components/modal/ErrorAndSuccesPopup";
// import Loader from "../components/Loader/Loader";

// export default function UpdatePost() {
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
//   const quillRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { postId } = useParams();

//   const currentUser = useSelector((state) => state.user.currentUser);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get(`/api/post/getposts?postId=${postId}`);
//         const data = res.data;

//         console.log(data);

//         if (!res) {
//           setPublishError(data.message);
//           return;
//         }

//         setPostTitle(data.posts[0].title);
//         setThumbnail(data.posts[0].image);
//         setCategory(data.posts[0].category);
//         setSubcategory(data.posts[0].subCategory);
//         setPostContent(data.posts[0].content);
//       } catch (error) {
//         console.error("Error fetching post:", error.message);
//         setPublishError("Failed to fetch post.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPost();
//   }, [postId]);

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
//       image: thumbnail,
//     };

//     try {
//       setLoading(true);
//       const res = await axios.put(
//         `/api/post/updatepost/${postId}/${currentUser._id}`,
//         updatedFormData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res) {
//         setPublishError(null);
//         setPublishSuccess("Post updated successfully.");

//         navigate(`/post/${res?.data?.slug}/${res?.data?._id}`);
//       }
//     } catch (error) {
//       setPublishError(error.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-center mt-20 bg-gradient-to-b from-purple-50 to-white p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-3xl bg-purple-100 shadow-lg rounded-lg p-8 mt-12"
//       >
//         <h2 className="text-3xl font-bold text-center mb-8">Update Post</h2>

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
//             onClose={() => {
//               setImageUploadError(null);
//               setImageUploadProgress(null);
//             }}
//           />
//         )}

//         <div className="text-center">
//           <button
//             type="submit"
//             className="flex items-center justify-center w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition duration-300 space-x-2"
//           >
//             <FaPaperPlane className="text-lg" />
//             <span>{loading ? "Updating" : "Update Post"}</span>
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

// New appraoch with zod validations
import { useRef, useState, useCallback, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Popup from "../components/modal/ErrorAndSuccesPopup";
import Loader from "../components/Loader/Loader";
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
    .max(10000, "Content cannot be more than 10000 characters")
    .refine((value) => value.trim().replace(/<\/?[^>]+(>|$)/g, "").length > 0, {
      message: "Content is required and cannot be empty",
    }),

  thumbnail: z.string().min(1, "Thumbnail is required"),
});

export default function UpdatePost() {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState("");
  const [publishError, setPublishError] = useState("");
  const quillRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { postId } = useParams();

  const currentUser = useSelector((state) => state.user.currentUser);

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/post/getposts?postId=${postId}`);
        const data = res.data;

        if (!res) {
          setPublishError(data.message);
          return;
        }

        setValue("title", data.posts[0].title);
        setValue("category", data.posts[0].category);
        setValue("subCategory", data.posts[0].subCategory);
        setValue("content", data.posts[0].content);
        setValue("thumbnail", data.posts[0].image);
        setThumbnail(data.posts[0].image);
      } catch (error) {
        console.error("Error fetching post:", error.message);
        setPublishError("Failed to fetch post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, setValue]);

  useEffect(() => {
    setValue("subcategory", "");
  }, [selectedCategory, setValue]);

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
      setValue("thumbnail", "");
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
        setValue("thumbnail", "");
        setThumbnail(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setValue("thumbnail", downloadURL);
          setThumbnail(downloadURL);
          clearErrors("thumbnail");
        });
      }
    );
  };

  const removeThumbnail = () => {
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
      const res = await axios.put(
        `${import.meta.env.VITE_BACK_END_URL}/api/post/updatepost/${postId}/${currentUser._id}`,
        { ...data, image: thumbnail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        setPublishError(null);
        setPublishSuccess("Post updated successfully.");

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center mt-16 bg-gradient-to-b from-purple-50 to-white p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-purple-100 shadow-lg rounded-lg p-4 mt-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Update Blog</h2>

        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Blog Title
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
          <label className="block text-lg font-medium mb-2">Thumbnail</label>
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
              Category
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
              Subcategory
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
                  value={field.value}
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
            <span>{loading ? "Updating" : "Update Post"}</span>
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
