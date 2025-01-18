/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Shield,
  User,
  LogOut,
  Home,
  FileText,
  Users,
  PlusCircle,
  LogOutIcon,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "flowbite-react";
import axios from "axios";
import { signoutSuccess } from "../redux/user/userSlice";
import UpdatePasswordModal from "../components/modal/UpdatePasswordModal";
import defaultProfile from "../assets/default-profile.jpg";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpenLg, setIsProfileOpenLg] = useState(false); // For large screens
  const [showUserOptions, setShowUserOptions] = useState(false);

  const profileRefLg = useRef(null); // Large screen profile dropdown ref

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileLg = () => setIsProfileOpenLg(!isProfileOpenLg);

  const closeProfileDropdownLg = () => setIsProfileOpenLg(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] =
    useState(false);

  // Close profile dropdown when clicking outside (large screens)
  useEffect(() => {
    const handleClickOutsideLg = (event) => {
      if (
        profileRefLg.current &&
        !profileRefLg.current.contains(event.target)
      ) {
        setIsProfileOpenLg(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideLg);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLg);
    };
  }, []);

  // Function to toggle the modal visibility
  const toggleUpdatePasswordModal = () => {
    setIsUpdatePasswordModalOpen(!isUpdatePasswordModalOpen);
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACK_END_URL}/api/user/logout`);
      dispatch(signoutSuccess());
      localStorage.clear();
      navigate("/sign-in");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(errorMessage);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 border-b-2 border-purple-900 bg-gradient-to-r from-black via-purple-900 to-black shadow-lg z-50">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="lg:w-[20%] lg:flex lg:justify-start">
          <Link
            to="/"
            className="text-lg sm:text-2xl font-extrabold text-white transition-transform transform hover:scale-105 flex items-center"
          >
            <img src={logo} className="lg:h-12 lg:w-52 h-8 w-32" alt="logo" />
          </Link>
        </div>

        {/* Navigation for large screens */}
        <div className="lg:w-[60%] lg:flex lg:justify-center">
          <nav className="hidden lg:flex gap-6">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-white border-b-2 border-purple-400 pb-1"
                  : "text-white hover:text-purple-200"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-white border-b-2 border-purple-400 pb-1"
                  : "text-white hover:text-purple-200"
              }
            >
              Blogs
            </NavLink>
            <NavLink
              to="/authors"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-white border-b-2 border-purple-400 pb-1"
                  : "text-white hover:text-purple-200"
              }
            >
              Authors
            </NavLink>
          </nav>
        </div>

        <div
          className="hidden lg:flex items-center lg:w-[20%] lg:justify-end"
          ref={profileRefLg}
        >
          {/* Profile Dropdown for Large Screens */}
          {currentUser ? (
            <div className="relative p-3 rounded-full">
              <button
                onClick={toggleProfileLg}
                className="flex items-center text-white hover:text-purple-200 transition duration-300"
              >
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture}
                  className="border-white border-2 rounded-full"
                  rounded
                />
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              {isProfileOpenLg && (
                <div className="absolute right-0 mt-2 w-52 text-xs bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="flex items-center justify-center px-4 py-2 space-x-3 border-b border-purple-200">
                    {/* Avatar Icon */}
                    {/* <UserCircle className="text-purple-900 h-6 w-6" /> */}
                    {/* Username */}
                    <span className="text-sm font-semibold text-purple-900">
                      {currentUser.username}
                    </span>
                  </div>
                  <NavLink
                    to="/create-post"
                    onClick={closeProfileDropdownLg}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 hover:bg-purple-200 transition ${
                        isActive ? "font-bold bg-purple-100" : ""
                      }`
                    }
                  >
                    <div>
                      <PlusCircle className="inline-block mr-2 text-purple-900 h-4 w-4" />
                      <span className="text-purple-900">Create New Blog</span>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/dashboard"
                    onClick={closeProfileDropdownLg}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 hover:bg-purple-200 transition ${
                        isActive ? "font-bold bg-purple-100" : ""
                      }`
                    }
                  >
                    <User className="inline-block mr-2 text-purple-900 h-4 w-4" />
                    <span className="text-purple-900">Dashboard</span>
                  </NavLink>

                  <div onClick={toggleUpdatePasswordModal}>
                    <NavLink
                      to="#"
                      onClick={closeProfileDropdownLg}
                      className="flex items-center px-4 py-2 hover:bg-purple-200 transition"
                    >
                      <Shield className="inline-block mr-2 text-purple-900 h-4 w-4" />
                      <span className="text-purple-900">Update Password</span>
                    </NavLink>
                  </div>

                  <div onClick={logout}>
                    <NavLink
                      to="#"
                      onClick={closeProfileDropdownLg}
                      className="flex items-center px-4 py-2 hover:bg-red-200 transition"
                    >
                      <LogOut className="inline-block mr-2 text-red-600 h-4 w-4" />
                      <span className="text-red-600">Logout</span>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="relative right-0 mt-2  px-3 py-2 rounded-md shadow-lg text-white bg-red-600"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="mt-3">
            {/* Hamburger menu for small and medium screens */}
            <button
              className="lg:hidden text-white hover:text-purple-200 transition duration-300"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-4/5 bg-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-6 flex flex-col text-white mb-6">
            {/* Close Button */}
            <div className="flex justify-end">
              <button onClick={toggleMenu} className="">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <img
                src={currentUser?.profilePicture || defaultProfile} // Dynamic profile image
                alt="User"
                className="h-20 w-20 mx-auto rounded-full border-4 border-white object-cover mb-3"
              />
              <p className="font-bold text-lg">
                {currentUser?.username || "Guest"}
              </p>
              <p className="text-sm text-purple-200">
                {currentUser?.email || "Welcome!"}
              </p>
            </div>
            {currentUser && (
              <button
                onClick={() => setShowUserOptions(!showUserOptions)}
                className="mt-4 flex items-center justify-center text-purple-800 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-50 transition duration-300"
              >
                <span className="mr-2">User Options</span>
                <ChevronDown
                  className={`h-5 w-5 transform ${
                    showUserOptions ? "rotate-180" : "rotate-0"
                  } transition-transform duration-300`}
                />
              </button>
            )}
          </div>

          {/* User Options (Toggleable) */}
          {currentUser && showUserOptions && (
            <div
              className="flex flex-col space-y-4 mb-6 px-4 overflow-hidden  transition-all duration-500 ease-in-out"
              style={{
                maxHeight: showUserOptions ? "150px" : "0",
                opacity: showUserOptions ? "1" : "0",
              }}
            >
              <NavLink
                to="/create-post"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 hover:bg-purple-100 transition rounded-md ${
                    isActive ? "font-bold bg-purple-100" : ""
                  }`
                }
              >
                <PlusCircle className="text-purple-900 h-4 w-4 mr-2" />
                <span className="text-purple-900">Create New Blog</span>
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 hover:bg-purple-100 transition rounded-md ${
                    isActive ? "font-bold bg-purple-100" : ""
                  }`
                }
              >
                <User className="text-purple-900 h-4 w-4 mr-2" />
                <span className="text-purple-900">Dashboard</span>
              </NavLink>

              <div onClick={toggleUpdatePasswordModal}>
                <NavLink
                  to="#"
                  onClick={toggleMenu}
                  className="flex items-center px-4 py-2 hover:bg-purple-100 transition rounded-md"
                >
                  <Shield className="text-purple-900 h-4 w-4 mr-2" />
                  <span className="text-purple-900">Update Password</span>
                </NavLink>
              </div>
            </div>
          )}

          {/* Menu Options */}
          <nav className="flex flex-col space-y-4 px-4 mb-4">
            <NavLink
              to="/home"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md hover:bg-purple-50 transition ${
                  isActive ? "font-bold bg-purple-100" : ""
                }`
              }
            >
              <Home className="text-purple-900 h-4 w-4 mr-2" />
              <span className="text-purple-900">Home</span>
            </NavLink>

            <NavLink
              to="/blogs"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md hover:bg-purple-50 transition ${
                  isActive ? "font-bold bg-purple-100" : ""
                }`
              }
            >
              <FileText className="text-purple-900 h-4 w-4 mr-2" />
              <span className="text-purple-900">Blogs</span>
            </NavLink>

            <NavLink
              to="/authors"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md hover:bg-purple-50 transition ${
                  isActive ? "font-bold bg-purple-100" : ""
                }`
              }
            >
              <Users className="text-purple-900 h-4 w-4 mr-2" />
              <span className="text-purple-900">Authors</span>
            </NavLink>

            <NavLink
              to="/sign-in"
              onClick={logout}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-red-500 rounded-md hover:bg-red-900 transition ${
                  isActive ? "font-bold bg-red-300" : ""
                }`
              }
            >
              <LogOutIcon className="text-red-500 h-4 w-4 mr-2" />
              <span>Logout</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Update Password Modal */}
      <UpdatePasswordModal
        isModalOpen={isUpdatePasswordModalOpen}
        closeModal={toggleUpdatePasswordModal}
      />
    </header>
  );
}
