/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Spinner } from "flowbite-react";
import OAuth from "../../components/OAuth";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schema for Validation
const signUpSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(20, { message: "Atmost 255 characters are accepted" })
    .refine((val) => /^[a-zA-Z\s]+$/.test(val), {
      message: "Full name can only contain letters and spaces",
    }),
  email: z
    .string()
    .email({ message: "Email address is required" })
    .refine((val) => val.includes("@"), { message: "Email must contain @" }),
  password: z
    .string()
    .min(8, { message: "Password is required and must be at least 8 characters" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one digit",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await axios.post("/api/auth/signup", data, {
        headers: { "Content-Type": "application/json" },
      });

      const responseData = res.data;

      if (responseData.success === false) {
        setLoading(false);
        return setErrorMessage(responseData.message);
      }

      setLoading(false);

      if (res.status === 200) {
        setSuccessMessage(
          "Signup successful! Please check your email to verify your account."
        );
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setLoading(false);
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
            <h2 className="text-3xl font-bold text-purple-700 my-4">Sign Up</h2>
          </div>

          {/* Google Sign Up */}
          <OAuth />

          <div className="text-center my-4 text-gray-500">or</div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-light focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
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
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-purple-500 hover:underline">
              Sign In
            </Link>
          </p>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
          {successMessage && <p>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
