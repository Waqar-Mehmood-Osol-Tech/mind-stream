// import { Link } from "react-router-dom";

// /* eslint-disable react/prop-types */
// function AuthorCard({
//   id,
//   profileImage,
//   name,
//   blogsPublished,
//   userId,
// }) {
//   return (
//     <div
//       key={id}
//       className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105"
//     >
//       <img
//         src={profileImage}
//         alt={name}
//         className="w-24 h-24 rounded-full border-4 border-purple-800 mx-auto mb-4"
//       />
//       <h2 className="text-xl font-semibold text-gray-700">{name}</h2>
//       <p className="text-gray-500">Blogs Published: {blogsPublished}</p>
//       {/* <p className="text-gray-500">Followers: {followers}</p> */}
//       <Link to={`/author/${userId}`}>
//         <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300">
//           View Profile
//         </button>
//       </Link>
//     </div>
//   );
// }

// export default AuthorCard;

import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
function AuthorCard({ id, profileImage, name, blogsPublished, userId }) {
  return (
    <div
      key={id}
      className="rounded-lg shadow-lg overflow-hidden bg-white transition-transform transform hover:scale-105"
    >
      <div
        style={{
          backgroundImage: `url(${profileImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          height: "8rem", // Adjust header height
        }}
        className="relative"
      >
        {/* Black tone overlay */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Black overlay with reduced opacity
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        ></div>
      </div>

      {/* Profile Image */}
      <div className="relative -mt-16">
        <img
          src={profileImage}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-white mx-auto"
        />
      </div>

      {/* Content Section */}
      <div className="bg-white text-center p-6">
        <h2 className="text-xl font-semibold text-gray-700">{name}</h2>
        <p className="text-gray-500">Blogs Published: {blogsPublished}</p>
        <Link to={`/author/${userId}`}>
          <button className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AuthorCard;
