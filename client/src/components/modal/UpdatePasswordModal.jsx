/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import Popup from "./ErrorAndSuccesPopup";

const passwordSchema = z
  .object({
    currentPassword: z.string().nonempty("Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/\d/, "Password must include at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must include at least one special character"
      ),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

function UpdatePasswordModal({ isModalOpen, closeModal }) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const { currentUser } = useSelector((state) => state.user);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const modalRef = useRef(null);

  const onSubmit = async (data) => {
    try {
      await axios.post(`/api/auth/update-password/${currentUser._id}`, data, {
        withCredentials: true,
      });
      setSuccess("Password updated successfully!");

      reset();

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.response.data.message || "Something went wrong");
    }
  };

  const closeModalFunc = () => {
    clearErrors();
    closeModal();
  };

   // Close modal when clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModalFunc(); // Close the modal if clicking outside
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, closeModal]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full" ref={modalRef}>
        <div className="flex w-full justify-center bg-gradient-to-r from-purple-800 to-purple-600 py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Update Password</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/* Current Password */}
          <div>
            <label className="block text-purple-900 mb-2">
              Current Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword")}
                className="input w-full border-2 border-purple-900 p-2 rounded-md"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showCurrentPassword ? (
                  <Eye className="text-purple-900" />
                ) : (
                  <EyeOff className="text-purple-900" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-600 text-xs">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-purple-900 mb-2">
              New Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className="input w-full border-2 border-purple-900 p-2 rounded-md"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showNewPassword ? (
                  <Eye className="text-purple-900" />
                ) : (
                  <EyeOff className="text-purple-900" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-600 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-purple-900 mb-2">
              Confirm New Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="input w-full border-2 border-purple-900 p-2 rounded-md"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <Eye className="text-purple-900" />
                ) : (
                  <EyeOff className="text-purple-900" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModalFunc}
              className="bg-gray-300 text-black py-2 px-6 rounded-md mt-8 hover:bg-gray-500 "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white py-2 px-6 rounded-md mt-8 hover:bg-purple-900"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {success && (
        <Popup
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}
      {error && (
        <Popup message={error} type="error" onClose={() => setError(null)} />
      )}
    </div>
  );
}

export default UpdatePasswordModal;
