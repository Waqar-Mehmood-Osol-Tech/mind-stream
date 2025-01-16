import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OurStory = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-screen mt-16 flex items-center justify-center px-6">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Our Story
        </h2>
        <p className="text-xl text-center text-gray-600 italic mb-8">
          "Inspiring revolutions one thought at a time."
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          Welcome to{" "}
          <span className="text-purple-900 font-bold">MindStream</span>, a haven
          where ideas meet creativity and revolution begins. We believe that
          every thought, no matter how small, has the potential to inspire
          change.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          Our platform provides a space for bloggers, thinkers, and dreamers to
          share their voices with a global audience. At MindStream, your
          thoughts aren't just words; they are seeds of transformation.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          We are more than a blogging platform—we are a movement of innovation,
          expression, and connection. By sharing your stories and perspectives,
          you join a community of change-makers dedicated to shaping a better
          world.
        </p>
        <p className="text-gray-700 leading-8">
          Ready to make your mark? Let your words inspire and ignite the minds
          of readers across the globe. Join us in creating a revolution that
          starts with a single thought.
        </p>
        <div className="mt-8 text-center">
          <Link to={currentUser !== null ? "/create-post" : "/sign-in"}>
            <button className="bg-purple-900 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300">
              Start Writing Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
