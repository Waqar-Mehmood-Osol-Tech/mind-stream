import React from "react";
import BlogDetail from "../pages/BlogDetail.jsx";
import UpdatePost from "../pages/UpdatePost.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import AuthorProfilePage from "../pages/AuthorProfilePage.jsx";
import UnderDevelopment from "../pages/UnderDevelopment.jsx";
import OurStory from "../pages/About.jsx";

const Home = React.lazy(() => import("../pages/Home.jsx"));
const SignIn = React.lazy(() => import("../pages/auth/SignIn.jsx"));
const SignUp = React.lazy(() => import("../pages/auth/SignUp.jsx"));
const Blogs = React.lazy(() => import("../pages/Blogs.jsx"));
const AuthorsPage = React.lazy(() => import("../pages/Authors.jsx"));
const ProfilePage = React.lazy(() => import("../pages/Profile.jsx"));
const CreatePost = React.lazy(() => import("../pages/CreatePost.jsx"));
const UserDashboard = React.lazy(() => import("../pages/Dashboard.jsx"));

export const RoutesName = {
  userRoutes: [
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "dashboard",
      element: <UserDashboard />,
    },
    {
      path: "profile",
      element: <ProfilePage />,
    },
    {
      path: "create-post",
      element: <CreatePost />,
    },
    {
      path: "/post/:postSlug/:postId",
      element: <BlogDetail />,
    },
    {
      path: "/update-post/:postId",
      element: <UpdatePost />,
    },
    {
      path: "/author/:userId",
      element: <AuthorProfilePage />,
    },
    {
      path: "/under-development",
      element: <UnderDevelopment />,
    },
    {
      path: "/our-story",
      element: <OurStory />,
    },
  ],

  publicRoutes: [
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "blogs",
      element: <Blogs />,
    },
    {
      path: "authors",
      element: <AuthorsPage />,
    },
    {
      path: "/author/:userId",
      element: <AuthorProfilePage />,
    },
    {
      path: "/post/:postSlug/:postId",
      element: <BlogDetail />,
    },
    {
      path: "/under-development",
      element: <UnderDevelopment />,
    },

    {
      path: "/our-story",
      element: <OurStory />,
    },
  ],

  authRoutes: [
    {
      path: "sign-up",
      element: <SignUp />,
    },
    {
      path: "sign-in",
      element: <SignIn />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
    {
      path: "/verify-email/:token",
      element: <VerifyEmail />,
    },
  ],
};
