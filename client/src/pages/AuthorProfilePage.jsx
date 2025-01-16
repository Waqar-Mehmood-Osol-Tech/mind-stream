/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { BlogCard } from "../components/BlogCard";

export default function AuthorProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchPosts();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user/${userId}`);
      setUser(res.data);
    } catch (error) {
      setError("Failed to load user profile. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPost(true);
      const res = await axios.get(`/api/post/getposts?userId=${userId}`);
      if (res.data?.posts) {
        setUserPosts(res.data.posts);
        setShowMore(res.data.posts.length >= 6);
      }
    } catch (error) {
      setError("Failed to load user posts. Please try again later.");
      console.log(error);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleShowMore = async () => {
    try {
      const startIndex = userPosts.length;
      const res = await axios.get(
        `/api/post/getPosts?userId=${userId}&startIndex=${startIndex}`
      );
      if (res.data?.posts) {
        setUserPosts((prev) => [...prev, ...res.data.posts]);
        setShowMore(res.data.posts.length >= 6);
      }
    } catch (error) {
      setError("Failed to load more posts. Please try again later.");
      console.log(error);
    }
  };

  if (loading || loadingPost) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-8 text-gray-600">User not found.</div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen mt-14 bg-gray-50">
      {/* Profile Header */}
      <div className="relative w-full h-72 bg-gray-800">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
          <h1 className="text-4xl font-bold mt-4">{user.username}</h1>
          <p className="text-sm italic mt-1">Member Since: {memberSince}</p>
        </div>
      </div>

      {/* Bio and Interests Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Headline */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">
              About the Author
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {user.headline || "Learn more about the person behind the blogs."}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bio Section */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800">Bio</h3>
              <p className="mt-2 text-gray-600">
                {user.bio || "No bio provided."}
              </p>
            </div>

            {/* Interests Section */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800">Interests</h3>
              <p className="mt-2 text-gray-600">
                {user.interests || "No interests provided."}
              </p>
            </div>

            {/* Blogs Published */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Blogs Published
              </h3>
              <h3 className="mt-2 text-4xl font-bold text-purple-600">
                {userPosts.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto px-4 pb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Author&apos;s Posts
        </h2>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <BlogCard
                key={post._id}
                postId={post._id}
                title={post.title}
                image={post.image}
                date={post.createdAt}
                post={post}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center mt-16">
            <p className="text-gray-400 italic">
              This author hasn&apos;t published any posts yet.
            </p>
          </div>
        )}
        {showMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
            >
              Show More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
