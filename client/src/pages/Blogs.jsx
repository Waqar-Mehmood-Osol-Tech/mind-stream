import { useEffect, useRef, useState } from "react";
import { Search, Filter, Frown } from "lucide-react";
import { BlogCard } from "../components/BlogCard";
import axios from "axios";
import Loader from "../components/Loader/Loader";

const categories = ["All", "technology", "lifestyle", "health"];

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const BLOGS_PER_PAGE = 6;

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDisplayedBlogs(allBlogs.slice(0, BLOGS_PER_PAGE));
    setShowMore(allBlogs.length > BLOGS_PER_PAGE);
  }, [allBlogs]);

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/post/getAllPosts`);
      if (res && Array.isArray(res.data.posts)) {
        setAllBlogs(res.data.posts);
      } else {
        console.error("Unexpected API response:", res);
        setError("Failed to load blogs. Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error getting blogs:", error.response || error);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (category === "All") {
        return ["All"];
      } else {
        const newCategories = prev.filter((c) => c !== "All");
        if (newCategories.includes(category)) {
          return newCategories.filter((c) => c !== category);
        } else {
          return [...newCategories, category];
        }
      }
    });
  };

  const filteredBlogs = allBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.includes("All") ||
        selectedCategories.includes(blog.category))
  );

  const handleShowMore = () => {
    const currentLength = displayedBlogs.length;
    const nextBlogs = allBlogs.slice(
      currentLength,
      currentLength + BLOGS_PER_PAGE
    );
    setDisplayedBlogs((prev) => [...prev, ...nextBlogs]);
    if (displayedBlogs.length + nextBlogs.length >= allBlogs.length) {
      setShowMore(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white mt-16">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center ">
          Explore Unique Voices
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 bg-white w-36 border border-purple-300 rounded-full flex items-center text-purple-600 hover:bg-purple-50 transition duration-300"
            >
              <Filter className="mr-2 h-4 w-4" /> Categories
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center px-4 py-2 hover:bg-purple-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Display selected category or categories */}
        <div className="text-center mt-8 text-xl font-medium text-purple-600">
          {selectedCategories.includes("All")
            ? ""
            : `Showing results for "${selectedCategories.join(", ")}"`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {(searchTerm || !selectedCategories.includes("All")
            ? filteredBlogs
            : displayedBlogs
          ).map((blog) => (
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

        {(searchTerm || !selectedCategories.includes("All")) &&
          filteredBlogs.length === 0 && (
            // <div className="text-center text-gray-600 mt-8">
            //   No blogs found matching your search or selected categories.
            // </div>
            <div className="flex flex-col w-full mt-16 text-center items-center justify-center">
              <Frown size={76} className="text-purple-900" />
              <p  className="text-lg  font-semibold mt-12">
                No blogs found matching your search or selected categories.
              </p>
            </div>
          )}

        {!searchTerm && selectedCategories.includes("All") && showMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
            >
              Show More Blogs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
