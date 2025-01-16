/* eslint-disable react/no-unknown-property */
// /* eslint-disable react/no-unknown-property */
import { Link } from "react-router-dom";
import { ArrowRight, Pen, TrendingUp } from "lucide-react";
import { BlogCard } from "../components/BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { useSelector } from "react-redux";

import canvaLogo from "../assets/brands/Canva-Logo.png";
import adobeLogo from "../assets/brands/Adobe-Logo.png";
import microsoftLogo from "../assets/brands/Microsoft-Office-365-Logo.png";
import notionLogo from "../assets/brands/Notion-Logo.png";
import grammarlyLogo from "../assets/brands/Grammarly-Logo.png";
import evernoteLogo from "../assets/brands/evernote-Logo.png";
import homeBanner from "../assets/homeBanner.png"

export default function Home() {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pBlogsLaoding, setPBlogsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchLatestBlogs();
    fetchPopularBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/post/getPosts`, {
        params: {
          limit: 3,
          order: "desc",
        },
      });

      if (res && Array.isArray(res.data.posts)) {
        setLatestBlogs(res.data.posts);
      } else {
        setError("Failed to load latest blogs. Unexpected error occurred.");
      }
    } catch (err) {
      setError(
        "Failed to load latest blogs. Please try again later.",
        err,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularBlogs = async () => {
    try {
      setPBlogsLoading(true);
      const res = await axios.get(`/api/post/getPosts`);

      if (res && Array.isArray(res.data.posts)) {
        const blogsWithComments = await Promise.all(
          res.data.posts.map(async (blog) => {
            const commentCount = await getCommentCount(blog._id);
            return { ...blog, commentCount };
          })
        );

        const sortedBlogs = blogsWithComments.sort(
          (a, b) => b.commentCount - a.commentCount
        );

        setPopularBlogs(sortedBlogs.slice(0, 4));
      } else {
        setError("Failed to load popular blogs. Unexpected error occurred.");
      }
    } catch (err) {
      setError("Failed to load popular blogs. Please try again later.", err);
    }
    finally{
      setPBlogsLoading(false);
    }
  };

  const getCommentCount = async (postId) => {
    try {
      const res = await axios.get(`/api/comment/getPostComments/${postId}`);
      if (res && Array.isArray(res.data)) {
        return res.data.length;
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
    return 0;
  };

  if (loading || pBlogsLaoding) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Main Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={homeBanner}
            alt="Abstract background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className=""></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            Mind Stream
          </h1>
          <p className="text-xl md:text-2xl mb-8 shimmer-text">
            Unleash Your Thoughts, Inspire the World
          </p>
          <Link
            to={currentUser !== null ? "/create-post" : "/sign-in"}
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white rounded-full group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-lg">Start Writing</span>
          </Link>
        </div>
        <style jsx>{`
          @keyframes moveNeon {
            0% {
              background-position: 0% 0%, 0% 0%;
            }
            100% {
              background-position: 200% 200%, 200% 200%;
            }
          }

          .shimmer-text {
            background: linear-gradient(
              to right,
              #fff 20%,
              #8a2be2 40%,
              #8a2be2 60%,
              #fff 80%
            );
            background-size: 200% auto;
            color: #000;
            background-clip: text;
            text-fill-color: transparent;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 3s linear infinite;
          }

          @keyframes shine {
            to {
              background-position: 200% center;
            }
          }
        `}</style>
      </section>

      {/* Latest Blogs Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              postId={blog._id}
              title={blog.title}
              image={blog.image}
              date={blog.createdAt}
              post={blog}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/blogs"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All Blogs
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Popular Blogs Section */}
      <section className="bg-purple-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Buzzing Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              >
                <TrendingUp className="w-8 h-8 text-purple-600 mb-4" />

                {/* Blog Title with Tooltip */}
                <Link to={`/post/${blog.slug}/${blog._id}`}>
                  <h3
                    className="text-xl font-semibold mb-2 line-clamp-2 h-14" // Ensure consistent height
                    title={blog.title}
                  >
                    {index + 1}. {blog.title}
                  </h3>
                </Link>

                {/* Category and Read More */}
                <div className="flex justify-between items-center mt-4">
                  <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <Link
                    to={`/post/${blog.slug}/${blog._id}`}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create New Post Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative bg-gradient-to-r from-purple-500 to-purple-900 rounded-lg shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-opacity-30 bg-gradient-to-bl from-purple-700 to-purple -900 mix-blend-multiply"></div>
          <div className="md:flex items-center relative z-10">
            <div className="md:w-1/2 p-12">
              <h2 className="text-3xl font-bold text-white mb-4 transition-transform duration-300 transform hover:scale-105">
                Start Your Journey with Us
              </h2>
              <p className="text-purple-100 mb-8 transition duration-300 hover:text-white">
                Share your thoughts, experiences, and insights with the world.
                Your voice matters!
              </p>
              <Link
                to={currentUser !== null ? "/create-post" : "/sign-in"}
                className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Write Your Thoughts
                <Pen className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <img
                src="https://cdn.openart.ai/published/xD3yjWWvJ8ST993UrGWx/snVygvhT_UffV_raw.jpg"
                alt="Write your thoughts"
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Moving Headlines Section */}
      {/* <section className="bg-purple-100 mt-12 py-8 mb-24 ">
        <h2 className="text-3xl font-bold mb-6 text-center">Empowering Creativity Together</h2>
        <div className="overflow-hidden whitespace-nowrap py-8">
          <div className="flex items-center space-x-44 animate-marquee">
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />

            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
        `}</style>
      </section> */}

      {/* Moving Headlines Section */}
      <section className="bg-purple-100 mt-12 py-8 mb-24">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Empowering Creativity Together
        </h2>
        <div className="overflow-hidden py-8">
          <div className="flex items-center space-x-44 animate-marquee">
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
            <img src={notionLogo} alt="notion" className="h-24" />
            <img src={grammarlyLogo} alt="grammarly" className="h-24" />
            <img src={canvaLogo} alt="canva" className="h-24" />
            <img src={microsoftLogo} alt="microsoft365" className="h-24" />
            <img src={adobeLogo} alt="adobe" className="h-24" />
            <img src={evernoteLogo} alt="evernote" className="h-24" />
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
            display: flex;
            width: calc(2 * 100%); /* Ensure seamless wrapping */
          }
        `}</style>
      </section>
    </div>
  );
}
