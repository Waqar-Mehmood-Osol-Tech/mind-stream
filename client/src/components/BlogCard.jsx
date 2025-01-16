/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

export const BlogCard = ({ post, postId, title, image, date }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-full">
    <Link to={`/post/${post.slug}/${postId}`}>
      <img src={image} alt={title} className="w-full h-48 object-cover" />
    </Link>
    <div className="p-4 flex flex-col justify-between flex-grow">
      {/* Category Badge */}
      <div className="mb-2">
        <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <Link to={`/post/${post.slug}/${postId}`}>
        <h3 title={title} className="text-xl font-semibold mb-4 line-clamp-2">{title}</h3>
      </Link>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        {/* Date */}
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>

        {/* Button */}
        <Link to={`/post/${post.slug}/${postId}`}>
          <button className="bg-purple-600 p-1 px-2 rounded-lg text-white">
            Read more
          </button>
        </Link>
      </div>
    </div>
  </div>
);
