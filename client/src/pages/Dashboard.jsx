import { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  FileText,
  User,
  LogOut,
  ChevronRight,
  Edit2,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import ProfilePage from "./Profile";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [activeTab]);

  const handleSignOut = async () => {
    try {
      await axios.post("/api/user/logout");
      dispatch(signoutSuccess());
      navigate("/sign-in");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(errorMessage);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/post/getposts?userId=${currentUser._id}`
      );

      const data = res.data;

      if (res) {
        setUserPosts(data.posts);
        if (data.posts.length < 6) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      setLoading(true);
      const res = await axios.get(
        `/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = res.data;

      if (res) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 6) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/post/deletePost/${postIdToDelete}/${currentUser._id}`
      );

      if (res.status !== 200) {
        console.log(res.data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return loading === true ? (
          <div>
            <Loader />
          </div>
        ) : (
          // <div className="min-w-full overflow-x-hidden">
          //   <div className="flex justify-between items-center mb-6">
          //     <h3 className="text-xl font-semibold">Your Posts</h3>
          //     {userPosts.length >= 1 && (
          //       <Link
          //         to="/create-post"
          //         className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
          //       >
          //         Create Post
          //       </Link>
          //     )}
          //   </div>
          //   {userPosts.length === 0 ? (
          //     <div className="text-center py-12">
          //       <FileText className="mx-auto h-16 w-16 mb-4" />
          //       <p className="text-xl ">No posts published yet.</p>
          //       <Link
          //         to="/create-post"
          //         className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-600 transition duration-300"
          //       >
          //         Create Your First Post
          //       </Link>
          //     </div>
          //   ) : (
          //     <div className="bg-purple-900 rounded-lg overflow-hidden">
          //       <div className="min-w-full divide-y bg-white">
          //         {/* Header */}
          //         <div className="bg-purple-900 text-white">
          //           <div className="grid grid-cols-2 md:grid-cols-[120px_120px_1fr_100px_120px] gap-4 px-4 py-3 text-sm font-medium">
          //             <div className="hidden md:block">DATE CREATED</div>
          //             <div className="hidden md:block">POST IMAGE</div>
          //             <div>POST TITLE</div>
          //             <div className="hidden md:block">CATEGORY</div>
          //             <div className="text-right">ACTIONS</div>
          //           </div>
          //         </div>
          //         {/* Rows */}
          //         <div className="bg-purple-100">
          //           {userPosts.map((post) => (
          //             <div
          //               key={post._id}
          //               className="grid grid-cols-2 md:grid-cols-[120px_120px_1fr_100px_120px] gap-4 px-4 py-3 items-center hover:bg-purple-400 transition duration-200"
          //             >
          //               <div className="hidden md:block text-sm">
          //                 {new Date(post.createdAt).toLocaleDateString(
          //                   "en-US",
          //                   {
          //                     day: "2-digit",
          //                     month: "2-digit",
          //                     year: "numeric",
          //                   }
          //                 )}
          //               </div>
          //               <Link
          //                 to={`/post/${post.slug}/${post._id}`}
          //                 className="hidden md:block"
          //               >
          //                 <div className="relative h-16 w-20 rounded overflow-hidden">
          //                   <img
          //                     src={post.image}
          //                     alt={post.title}
          //                     className="absolute inset-0 h-full w-full object-cover"
          //                   />
          //                 </div>
          //               </Link>
          //               <Link to={`/post/${post.slug}/${post._id}`}>
          //                 <div className="hover:text-slate-700 transition duration-200 line-clamp-2">
          //                   {post.title}
          //                 </div>
          //               </Link>
          //               <div className="hidden md:block text-sm">
          //                 {post.category || "reactjs"}
          //               </div>
          //               <div className="flex justify-end gap-2">
          //                 <Link
          //                   to={`/update-post/${post._id}`}
          //                   className="p-2 text-purple-900 hover:text-purple-700 transition duration-200"
          //                 >
          //                   <Edit2 className="h-4 w-4" />
          //                 </Link>
          //                 <button
          //                   onClick={() => {
          //                     setShowModal(true);
          //                     setPostIdToDelete(post._id);
          //                   }}
          //                   className="p-2 text-red-400 hover:text-red-300 transition duration-200"
          //                 >
          //                   <Trash2 className="h-4 w-4" />
          //                 </button>
          //               </div>
          //             </div>
          //           ))}
          //         </div>
          //       </div>
          //     </div>
          //   )}
          //   {showMore && (
          //     <button
          //       onClick={handleShowMore}
          //       className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300 flex items-center justify-center"
          //     >
          //       Show more
          //       <ChevronRight className="ml-2 h-5 w-5" />
          //     </button>
          //   )}
          // </div>

          <div className="min-w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Manage Your Blogs</h3>
              {userPosts.length >= 1 && (
                <Link
                  to="/create-post"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
                >
                  Create Post
                </Link>
              )}
            </div>
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 mb-4" />
                <p className="text-xl">No posts published yet.</p>
                <Link
                  to="/create-post"
                  className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-600 transition duration-300"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="bg-purple-900 rounded-lg overflow-hidden">
                {/* Table Scrollable Container */}
                <div className="overflow-x-auto">
                  <div className="min-w-[768px] divide-y bg-white">
                    {/* Header */}
                    <div className="bg-purple-900 text-white">
                      <div className="grid grid-cols-[120px_120px_1fr_100px_120px] gap-4 px-4 py-3 text-sm font-medium">
                        <div>DATE CREATED</div>
                        <div>POST IMAGE</div>
                        <div>POST TITLE</div>
                        <div>CATEGORY</div>
                        <div className="text-right">ACTIONS</div>
                      </div>
                    </div>
                    {/* Rows */}
                    <div className="bg-purple-100">
                      {userPosts.map((post) => (
                        <div
                          key={post._id}
                          className="grid grid-cols-[120px_120px_1fr_100px_120px] gap-4 px-4 py-3 items-center hover:bg-purple-400 transition duration-200"
                        >
                          <div className="text-sm">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <Link to={`/post/${post.slug}/${post._id}`}>
                            <div className="relative h-16 w-20 rounded overflow-hidden">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            </div>
                          </Link>
                          <Link to={`/post/${post.slug}/${post._id}`}>
                            <div className="hover:text-slate-700 transition duration-200 line-clamp-2">
                              {post.title}
                            </div>
                          </Link>
                          <div className="text-sm">
                            {post.category || "reactjs"}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/update-post/${post._id}`}
                              className="p-2 text-purple-900 hover:text-purple-700 transition duration-200"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setShowModal(true);
                                setPostIdToDelete(post._id);
                              }}
                              className="p-2 text-red-400 hover:text-red-300 transition duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300 flex items-center justify-center"
              >
                Show more
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            )}
          </div>
        );
      case "profile":
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen mt-14 lg:mt-20 bg-gradient-to-b from-purple-50 to-white">
      {/* Mobile menu button */}
      <button
        className="md:hidden relative p-2 bg-purple-600 text-white w-fit mt-6 ml-4 rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 mt-14 md:mt-0 bg-white shadow-lg fixed md:static inset-0 z-10`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 ">Dashboard</h2>
            <button
              onClick={() => {
                setSidebarOpen(false);
              }}
              className="md:hidden"
            >
              <X className=" h-6 w-6" />
            </button>
          </div>
          <ul>
            <li className="mb-2">
              <button
                className={`flex items-center w-full p-2 rounded-lg ${
                  activeTab === "posts"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveTab("posts");
                  setSidebarOpen(false);
                }}
              >
                <FileText className="mr-2 h-5 w-5" />
                My Blogs
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center w-full p-2 rounded-lg ${
                  activeTab === "profile"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveTab("profile");
                  setSidebarOpen(false);
                }}
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-100"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 mt-2 lg:mt-0 justify-center p-4 md:p-8 overflow-y-auto h-[calc(100vh-1rem)] hide-scrollbar">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </div>

      {/* Modal for delete Confirmation */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
