/* eslint-disable react/no-unknown-property */
import axios from "axios";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset link sent successfully.");
      setEmail("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-purple-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="">
              <img src={logo} alt="Logo" className="w-75 h-34" />
            </div>
            <p className="text-xl md:text-2xl mb-8 shimmer-text">
              Unleash Your Thoughts, Inspire the World
            </p>
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
          </div>
        </div>
        <div className="absolute inset-0 bg-opacity-60 bg-black"></div>
      </div>

      {/* Right Section: Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full">
          <div className="flex flex-col justify-start mb-6">
            <h2 className="text-3xl font-bold text-purple-700 my-4">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-4">
              Enter your email to receive a password reset link.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition duration-300 ease-in-out"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Sending...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
          <p className="text-gray-500 text-center mt-4">
            Remember your password?{" "}
            <Link to="/sign-in" className="text-purple-500 hover:underline">
              Sign In
            </Link>
          </p>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-green-400">{message}</p>
          )}
          {/* Error Message */}
          {errorMessage && (
            <p className="mt-4 text-center text-red-400">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
