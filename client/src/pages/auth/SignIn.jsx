/* eslint-disable react/no-unknown-property */
import axios from "axios";
import { Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../../redux/user/userSlice";
import OAuth from "../../components/OAuth";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schema for Validation
const signInSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password is required"),
});

const SignIn = () => {
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    try {
      dispatch(signInStart());

      const res = await axios.post("/api/auth/signin", data, {
        headers: { "Content-Type": "application/json" },
      });

      const responseData = res.data;

      if (responseData.success === false) {
        dispatch(signInFailure(responseData.message));
      }

      if (res.status === 200) {
        localStorage.setItem("access_token", res.data.token);
        dispatch(signInSuccess(responseData));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen flex justify-center lg:flex-row">
      {/* Left Section */}
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

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="flex flex-col justify-start w-full mb-6">
            <h2 className="text-3xl font-bold text-purple-700 my-4 ">
              Sign In
            </h2>
          </div>

          {/* Google Sign In */}
          <OAuth />

          <div className="text-center my-4 text-gray-500">or</div>

          {/* Email and Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-light focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="********"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-light focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <Eye className="text-purple-700" />
                  ) : (
                    <EyeOff className="text-purple-700" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-purple-500 hover:text-purple-600 text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition duration-300 ease-in-out"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/sign-up" className="text-purple-500 hover:underline">
              Sign Up
            </Link>
          </p>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
