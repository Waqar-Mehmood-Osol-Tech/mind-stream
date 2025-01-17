import { Link } from "react-router-dom";

const UnderDevelopment = () => {
  return (
    <div className="bg-purple-100 min-h-screen flex items-center justify-center">
      <div className="text-center px-6 py-10 bg-white bg-opacity-90 rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Coming Soon! 🚀
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We&apos;re currently working hard to bring this page to life. Stay
          tuned—it'll be live soon!
        </p>
        <div className="mt-4">
          <Link to={'/home'}>
            <button className="bg-purple-900 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300">
              Go Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
