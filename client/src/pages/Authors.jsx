/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import AuthorCard from "../components/AuthorCard";
import Loader from "../components/Loader/Loader";

export default function AuthorsPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [postCounts, setPostCounts] = useState({});
  const [countsFetched, setCountsFetched] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/user/getusers`);
      if (res.status === 200) {
        // Logic to exclude the currently logged in user...
        // const filteredUsers = currentUser
        //   ? res.data.users.filter((user) => user._id !== currentUser._id)
        //   : res.data.users;
        const filteredUsers = res.data.users;
        setUsers(filteredUsers);

        if (filteredUsers.length < 9) {
          setShowMore(false);
        }

        setCountsFetched(0);

        // Fetch post counts for all users
        filteredUsers.forEach((user) =>
          fetchPostCount(user._id, filteredUsers.length)
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPostCount = async (authorId, totalUsers) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/post/getposts?userId=${authorId}`);
      if (res && Array.isArray(res.data.posts)) {
        setPostCounts((prev) => {
          const updatedCounts = {
            ...prev,
            [authorId]: res.data.posts.length,
          };

          // Sort users based on updated postCounts
          setUsers((prevUsers) =>
            [...prevUsers].sort(
              (a, b) =>
                (updatedCounts[b._id] || 0) - (updatedCounts[a._id] || 0)
            )
          );

          return updatedCounts;
        });
      }
    } catch (error) {
      console.error(`Error fetching posts for author ${authorId}:`, error);
    } finally {
      setCountsFetched((prev) => {
        const updatedCount = prev + 1;
        if (updatedCount === totalUsers) {
          setLoading(false);
        }
        return updatedCount;
      });
    }
  };

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/api/user/getusers?startIndex=${startIndex}`
      );
      if (res.status === 200) {
        const newUsers = res.data.users;
        setUsers((prev) => [...prev, ...newUsers]);

        if (newUsers.length < 9) {
          setShowMore(false);
        }

        // Update countsFetched counter
        setCountsFetched(0);

        // Fetch post counts for the newly loaded users
        newUsers.forEach((user) => fetchPostCount(user._id, newUsers.length));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white mt-16">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Meet Our Authors
        </h1>

        <div className="text-center mb-8">
          <input
            type="text"
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-1/2 rounded-full border border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
          />
        </div>

        <div className="text-2xl font-semibold mb-8 text-center">
          Top Authors of MindStream
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((user) => (
            <AuthorCard
              key={user._id}
              name={user.username}
              profileImage={user.profilePicture}
              blogsPublished={postCounts[user._id] || 0}
              followers={user.followers?.length || 0}
              userId={user._id}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-600 mt-12">
            No authors found matching your search.
          </div>
        )}

        {showMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
