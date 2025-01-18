import { useEffect, useRef, useState } from "react";
import { Pencil, Check, X, Delete, FileText, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import axios from "axios";
import Popup from "../components/modal/ErrorAndSuccesPopup";
import Loader from "../components/Loader/Loader";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    headline: currentUser.headline || "Write a headline...",
    bio: currentUser.bio || "Write a short bio...",
    interests: currentUser.interests || "Write about your interests...",
  });

  const filePickerRef = useRef();

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      setLoading(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_BACK_END_URL}/api/user/delete/${
          currentUser._id
        }`,
        {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(deleteUserSuccess(res.data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(deleteUserFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      if (isEditing) {
        setFormData({ ...formData, profilePicture: URL.createObjectURL(file) });
      }
    }
  };

  const uploadImage = () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACK_END_URL}/api/user/update/${
          currentUser._id
        }`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(updateSuccess(response.data));
      setUpdateUserSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(updateFailure(errorMessage));
      setUpdateUserError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setPostLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/api/post/getposts?userId=${
          currentUser._id
        }`
      );
      if (res && Array.isArray(res.data.posts)) {
        setUserPosts(res.data.posts);
      } else {
        console.error("Unexpected API response:", res);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error.response || error);
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return postLoading === true ? (
    <div>
      <Loader />
    </div>
  ) : (
    // <div className="h-fit bg-gradient-to-b from-purple-50 to-white flex  justify-center p-4 ">
    //   <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
    //     <div
    //       className="relative h-48"
    //       style={{
    //         background:
    //           "linear-gradient(90deg, rgba(17,4,51,1) 0%, rgba(70,5,99,1) 35%, rgba(124,23,186,1) 100%)",
    //       }}
    //     >
    //       <div className="w-full h-full object-coverbg-gradient-to-r from-black via-purple-900 to-black" />
    //     </div>
    //     <form onSubmit={handleSubmit}>
    //       <div className="relative px-4 py-5 sm:p-6">
    //         <input
    //           type="file"
    //           accept="image/*"
    //           onChange={handleImageChange}
    //           ref={filePickerRef}
    //           hidden
    //         />
    //         <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
    //           {isEditing ? (
    //             <div
    //               onClick={() => filePickerRef.current.click()}
    //               className="cursor-pointer"
    //             >
    //               {imageFileUploadProgress && (
    //                 <CircularProgressbar
    //                   value={imageFileUploadProgress || 0}
    //                   strokeWidth={5}
    //                   styles={{
    //                     root: {
    //                       width: "100%",
    //                       height: "100%",
    //                       position: "absolute",
    //                       top: 0,
    //                       left: 0,
    //                       color: "purple",
    //                     },
    //                     path: {
    //                       stroke: `rgba(128, 0, 128, ${
    //                         imageFileUploadProgress / 100
    //                       })`,
    //                     },
    //                   }}
    //                 />
    //               )}
    //               <img
    //                 src={imageFileUrl || currentUser.profilePicture}
    //                 alt="Profile picture"
    //                 className={`w-32 h-32 rounded-full border-4 border-white ${
    //                   imageFileUploadProgress &&
    //                   imageFileUploadProgress < 100 &&
    //                   "opacity-60"
    //                 }`}
    //               />
    //             </div>
    //           ) : (
    //             <img
    //               src={currentUser.profilePicture}
    //               alt="Profile picture"
    //               className="w-32 h-32 rounded-full border-4 border-white"
    //             />
    //           )}
    //         </div>

    //         {/* Error for Image uplaod file Error */}
    //         {imageFileUploadError && (
    //           <Popup
    //             message={imageFileUploadError}
    //             type="error"
    //             onClose={() => setImageFileUploadError(null)}
    //           />
    //         )}
    //         <div className="mt-16">
    //           {isEditing ? (
    //             <div className="text-left">
    //               <label
    //                 htmlFor="username"
    //                 className="block text-lg font-semibold text-gray-900 mb-2"
    //               >
    //                 Full Name <span className="text-red-600">*</span>
    //               </label>
    //               <input
    //                 id="username"
    //                 type="text"
    //                 name="username"
    //                 value={formData.username}
    //                 onChange={handleChange}
    //                 className="block w-full text-2xl font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
    //               />
    //             </div>
    //           ) : (
    //             <h2 className="text-2xl font-bold text-gray-900 text-center">
    //               {currentUser.username}
    //             </h2>
    //           )}
    //         </div>

    //         <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
    //           <div>
    //             Blogs Published
    //             <span className="font-semibold text-purple-600">
    //               : {userPosts.length}
    //             </span>{" "}
    //           </div>
    //         </div>

    //         <div className="flex w-full justify-center mt-4">
    //           {isEditing ? (
    //             // <input
    //             //   id="email"
    //             //   type="email"
    //             //   name="email"
    //             //   value={formData.email}
    //             //   onChange={handleChange}
    //             //   className="font-semibol text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded w-1/2 py-1"
    //             // />
    //             <h2 className=" text-gray-900 font-semibold">
    //               {currentUser.email}
    //             </h2>
    //           ) : (
    //             <h2 className=" text-gray-900 font-semibold">
    //               {currentUser.email}
    //             </h2>
    //           )}
    //         </div>
    //         <div className="mt-6">
    //           <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
    //           {isEditing ? (
    //             <textarea
    //               id="bio"
    //               name="bio"
    //               value={formData.bio}
    //               onChange={handleChange}
    //               className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1"
    //               rows={3}
    //             />
    //           ) : (
    //             <p className="text-gray-600">{currentUser.bio}</p>
    //           )}
    //         </div>
    //         <div className="mt-6">
    //           <h3 className="text-lg font-semibold text-gray-900 mb-2">
    //             Interests
    //           </h3>
    //           {isEditing ? (
    //             <input
    //               id="interests"
    //               type="text"
    //               name="interests"
    //               value={formData.interests}
    //               onChange={handleChange}
    //               className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1"
    //             />
    //           ) : (
    //             <p className="text-gray-600">{currentUser.interests}</p>
    //           )}
    //         </div>

    //         <div className="mt-12 flex justify-between ">
    //           {isEditing ? (
    //             <>
    //               <button
    //                 type="submit"
    //                 className="mr-2 px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
    //                 disabled={imageFileUploading}
    //               >
    //                 {loading ? "Updating" : "Update"}
    //                 <Check className="w-5 h-5" />
    //               </button>
    //               <button
    //                 onClick={handleCancel}
    //                 className="px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-gray-300 text-gray-700 rounded-lg  hover:bg-gray-400 transition duration-300"
    //               >
    //                 Cancel
    //                 <X className="w-5 h-5" />
    //               </button>
    //             </>
    //           ) : (
    //             <div className="flex justify-between w-full mt-12">
    //               <button
    //                 onClick={handleEdit}
    //                 className="px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
    //               >
    //                 Edit
    //                 <Pencil className="w-10 h-5" />
    //               </button>
    //               <button
    //                 type="button"
    //                 onClick={() => setShowModal(true)}
    //                 className="px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
    //               >
    //                 Delete
    //                 <Delete className="w-5 h-5" />
    //               </button>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </form>
    //   </div>

    //   {updateUserSuccess && (
    //     <Popup
    //       message={updateUserSuccess}
    //       type="success"
    //       onClose={() => setUpdateUserSuccess(null)}
    //     />
    //   )}
    //   {updateUserError && (
    //     <Popup
    //       message={updateUserError}
    //       type="error"
    //       onClose={() => setUpdateUserError(null)}
    //     />
    //   )}

    //   {/* Modal for deletion */}
    //   {showModal && (
    //     <div
    //       style={{
    //         position: "fixed",
    //         top: "0",
    //         left: "0",
    //         width: "100%",
    //         height: "100%",
    //         backgroundColor: "rgba(0, 0, 0, 0.5)",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       <div
    //         style={{
    //           backgroundColor: "white",
    //           padding: "2rem",
    //           borderRadius: "8px",
    //           width: "400px",
    //           textAlign: "center",
    //         }}
    //       >
    //         <div
    //           style={{
    //             marginBottom: "1rem",
    //             color: "gray",
    //           }}
    //         >
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             strokeWidth="2"
    //             stroke="currentColor"
    //             style={{ width: "56px", height: "56px", margin: "0 auto" }}
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z"
    //             />
    //           </svg>
    //         </div>
    //         <h3 style={{ marginBottom: "1rem", color: "gray" }}>
    //           Are you sure you want to delete your account?
    //         </h3>
    //         <div
    //           style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
    //         >
    //           <button
    //             style={{
    //               backgroundColor: "red",
    //               color: "white",
    //               padding: "0.5rem 1rem",
    //               border: "none",
    //               borderRadius: "4px",
    //               cursor: "pointer",
    //             }}
    //             onClick={handleDelete}
    //           >
    //             Yes, I&apos;m sure
    //           </button>
    //           <button
    //             style={{
    //               backgroundColor: "gray",
    //               color: "white",
    //               padding: "0.5rem 1rem",
    //               border: "none",
    //               borderRadius: "4px",
    //               cursor: "pointer",
    //             }}
    //             onClick={() => setShowModal(false)}
    //           >
    //             No, cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div className="h-fit bg-gradient-to-b from-purple-50 to-white flex  justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
        {/* <div
          className="relative h-48"
          style={{
            background:
              "linear-gradient(90deg, rgba(17,4,51,1) 0%, rgba(70,5,99,1) 35%, rgba(124,23,186,1) 100%)",
          }}
        >
          <div className="w-full h-full object-coverbg-gradient-to-r from-black via-purple-900 to-black" />
        </div> */}
        <div className="relative h-48">
          <div
            style={{
              backgroundImage: `url(${currentUser.profilePicture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="absolute inset-0"
          ></div>

          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
            className="absolute inset-0"
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative px-4 py-5 sm:p-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              {isEditing ? (
                <div
                  onClick={() => filePickerRef.current.click()}
                  className="cursor-pointer"
                >
                  {imageFileUploadProgress && (
                    <CircularProgressbar
                      value={imageFileUploadProgress || 0}
                      strokeWidth={5}
                      styles={{
                        root: {
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          color: "purple",
                        },
                        path: {
                          stroke: `rgba(128, 0, 128, ${
                            imageFileUploadProgress / 100
                          })`,
                        },
                      }}
                    />
                  )}
                  <img
                    src={imageFileUrl || currentUser.profilePicture}
                    alt="Profile picture"
                    className={`w-32 h-32 rounded-full border-4 border-white ${
                      imageFileUploadProgress &&
                      imageFileUploadProgress < 100 &&
                      "opacity-60"
                    }`}
                  />
                </div>
              ) : (
                <img
                  src={currentUser.profilePicture}
                  alt="Profile picture"
                  className="w-32 h-32 rounded-full border-4 border-white"
                />
              )}
            </div>

            {/* Error for Image uplaod file Error */}
            {imageFileUploadError && (
              <Popup
                message={imageFileUploadError}
                type="error"
                onClose={() => setImageFileUploadError(null)}
              />
            )}

            <div className="mt-16 flex gap-2 items-center text-purple-900">
              <FileText />
              <p className="text-xl font-bold">General Details</p>
            </div>
            <div className="mt-4">
              {isEditing ? (
                <div className="text-left">
                  <label
                    htmlFor="username"
                    className="block text-lg font-semibold text-gray-900 mb-2"
                  >
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full text-2xl font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  {currentUser.username}
                </h2>
              )}
            </div>

            <div className="mt-4">
              {isEditing ? (
                <div className="text-left">
                  <label
                    htmlFor="headline"
                    className="block text-lg font-semibold text-gray-900 mb-2"
                  >
                    Headline <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="headline"
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="block w-full font-semibold text-md  text-gray-900 bg-gray-100 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <h2 className=" text-gray-600 text-center">
                  {currentUser.headline}
                </h2>
              )}
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">Member since: </span>
                {new Date(currentUser.createdAt).toDateString()}
              </p>
            </div>

            <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-black">
                  Blogs Published
                </span>
                <span className="font-semibold text-gray-600">
                  : {userPosts.length}
                </span>{" "}
              </div>
            </div>

            <div className="flex w-full justify-center mt-4">
              {isEditing ? (
                // <input
                //   id="email"
                //   type="email"
                //   name="email"
                //   value={formData.email}
                //   onChange={handleChange}
                //   className="font-semibol text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded w-1/2 py-1"
                // />
                <div className="flex gap-2 text-sm">
                  <p className="font-semibold text-black">Email</p>
                  <h2 className=" text-gray-600 font-semibold">
                    {currentUser.email}
                  </h2>
                </div>
              ) : (
                <div className="flex gap-2 text-sm">
                  <p className="font-semibold text-black">Email: </p>
                  <h2 className=" text-gray-600 font-semibold">
                    {currentUser.email}
                  </h2>
                </div>
              )}
            </div>

            <div className="text-purple-900 mt-8 flex gap-2">
              <Zap />
              <p className="text-xl font-bold">About Me</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600">{currentUser.bio}</p>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interests
              </h3>
              {isEditing ? (
                <input
                  id="interests"
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="text-gray-600">{currentUser.interests}</p>
              )}
            </div>

            <div className="mt-12 flex justify-between ">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="mr-2 px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                    disabled={imageFileUploading}
                  >
                    {loading ? "Updating" : "Update"}
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-gray-300 text-gray-700 rounded-lg  hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex justify-between w-full mt-12">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                  >
                    Edit
                    <Pencil className="w-10 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 flex flex-row gap-2 justify-center items-center text-md font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Delete
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {updateUserSuccess && (
        <Popup
          message={updateUserSuccess}
          type="success"
          onClose={() => setUpdateUserSuccess(null)}
        />
      )}
      {updateUserError && (
        <Popup
          message={updateUserError}
          type="error"
          onClose={() => setUpdateUserError(null)}
        />
      )}

      {/* Modal for deletion */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: "1rem",
                color: "gray",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                style={{ width: "56px", height: "56px", margin: "0 auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z"
                />
              </svg>
            </div>
            <h3 style={{ marginBottom: "1rem", color: "gray" }}>
              Are you sure you want to delete your account?
            </h3>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
            >
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleDelete}
              >
                Yes, I&apos;m sure
              </button>
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
