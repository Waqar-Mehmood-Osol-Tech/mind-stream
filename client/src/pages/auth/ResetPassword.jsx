/* eslint-disable react/no-unknown-property */
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import logo from "../../assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // Validation schema
  const schema = z
    .object({
      newPassword: z
        .string()
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter",
        })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: "Password must contain at least one special character",
        })
        .min(8, { message: "Password must be at least 8 characters long" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // Clear field-specific error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setErrors({});
      setMessage("");
      schema.parse(formData); // Validate form data

      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/auth/reset-password/${token}`,
        formData
      );
      setMessage(res.data.message || "Password changed successfully");
      setTimeout(() => navigate("/sign-in"), 3000); // Navigate to sign-in page
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map field-specific validation errors
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
          <div className="flex flex-col justify-start mb-6">
            <h2 className="text-3xl font-bold text-purple-700 my-4 ">
              Reset Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-700 bg-light focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {showPassword.newPassword ? (
                  <Eye
                    className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    onClick={() => toggleShowPassword("newPassword")}
                  />
                ) : (
                  <EyeOff
                    className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    onClick={() => toggleShowPassword("newPassword")}
                  />
                )}
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-700 bg-light focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {showPassword.confirmPassword ? (
                  <Eye
                    className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    onClick={() => toggleShowPassword("confirmPassword")}
                  />
                ) : (
                  <EyeOff
                    className="absolute top-3 right-4 text-gray-500 cursor-pointer"
                    onClick={() => toggleShowPassword("confirmPassword")}
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition duration-300 ease-in-out"
            >
              {loading ? "Changing..." : "Send Password"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-6 text-center ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
