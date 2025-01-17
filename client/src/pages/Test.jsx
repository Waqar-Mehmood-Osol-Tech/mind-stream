
// /* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { BlogCard } from "../components/BlogCard";
import Loader from "../components/Loader/Loader";
import AdComponent from "../components/AdComponent";

const BlogDetail = () => {
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { postId } = useParams();
  const [showLeftAd, setShowLeftAd] = useState(true);
  const [showRightAd, setShowRightAd] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/api/post/getposts?postId=${postId}`);
      if (res.data.posts.length > 0) {
        const fetchedPost = res.data.posts[0];
        setPost(fetchedPost);
        fetchAuthor(fetchedPost.userId);
        fetchRelatedPosts(fetchedPost.category);
      }
    } catch (error) {
      console.error("Error fetching post:", error.message);
    }
  };

  const fetchAuthor = async (userId) => {
    try {
      const res = await axios.get(`/api/user/${userId}`);
      setAuthor(res.data);
    } catch (error) {
      console.error("Error fetching author:", error.message);
    }
  };

  const fetchRelatedPosts = async (category) => {
    try {
      const res = await axios.get(`/api/post/getPosts`, {
        params: {
          category,
          limit: 3, // Fetch 3 related posts
        },
      });
      const filteredPosts = res.data.posts.filter(
        (blog) => blog._id !== postId
      );
      setRelatedPosts(filteredPosts || []);
    } catch (error) {
      console.error("Error fetching related posts:", error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // Function to handle sharing
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        currentUrl
      )}`;
      window.open(whatsappUrl, "_blank");
    });
  };

  // Function to close ads
  const closeAd = (side) => {
    if (side === "left") {
      setShowLeftAd(false);
    } else {
      setShowRightAd(false);
    }
  };

  if (!post) {
    return <Loader />;
  }

  return (
    // With Ad Space:
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={post?.image || "/placeholder.svg"}
            alt={post?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white shimmer-text">
            {post?.title}
          </h1>
          <div className="flex justify-center items-center space-x-4 text-sm md:text-base">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(post?.createdAt)}
            </span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {author?.username}
            </span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {post?.category}
            </span>
          </div>
        </div>
      </section>

      {/* Content Section with Sticky Ads */}
      <section className="container mx-auto px-4 py-16 flex justify-between relative">
        {/* Left Sticky Ad */}
        <div className="">
          <AdComponent
            position="left"
            imageUrl="https://sisteradamson417864484.wordpress.com/wp-content/uploads/2022/11/httpswww.minimeinsights.com20200912cadbury-dairy-milk-celebrates-the-goodness-of-everyone.png"
            onClose={closeAd}
          />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blogs"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blogs
          </Link>

          <article className="prose lg:prose-xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <div className="mt-12 flex justify-between items-center">
            <div className="flex items-center space-x-4 w-[80%]">
              <Link to={`/author/${author?._id}`}>
                <div className="rounded-full w-12 h-12 border border-purple-900">
                  <img
                    src={author?.profilePicture || "/placeholder.svg"}
                    alt="Author"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </Link>

              <div>
                <Link to={`/author/${author?._id}`}>
                  <h3 className="font-semibold">{author?.username}</h3>
                </Link>
                <p className="text-sm text-gray-600">{author?.bio}</p>
              </div>
            </div>
            <Link
              to={"https://web.whatsapp.com/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="inline-flex items-center  bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
                onClick={handleShare}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </Link>
          </div>
        </div>

        {/* Right Sticky Ad */}
        <div className="">
          <AdComponent
            position="right"
            imageUrl="https://media.licdn.com/dms/image/v2/D5622AQEUleLIRfIV7Q/feedshare-shrink_2048_1536/B56ZPVNaRNGQAo-/0/1734448883935?e=2147483647&v=beta&t=meKpnptoF-rKAffP7qKX_PcAMB9cQFqXFFzqzJ-cfwM"
            onClose={closeAd}
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <CommentSection postId={postId} />
      </section>

      {/* Related Posts Section */}
      <section className="bg-purple-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Posts</h2>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((blog) => (
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
          ) : (
            <p className="text-center text-gray-600">No related posts yet!</p>
          )}
        </div>
      </section>
    </div>
    
  );
};

export default BlogDetail;
