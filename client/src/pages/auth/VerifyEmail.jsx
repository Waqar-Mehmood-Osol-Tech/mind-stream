import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert } from "flowbite-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const verifyEmail = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/api/auth/verify-email/${token}`
      );
      if (res.status === 200) {
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to sign-in...");
        setTimeout(() => navigate("/sign-in"), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      setTimeout(() => setStatus("error"), 5000); // Redirect after 5 seconds

      setErrorMessage(
        error.response?.data?.message ||
          "Verification failed. Invalid or expired token."
      );
    }
  };


  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          {status === "loading" ? "Verifying..." : "Verification Status"}
        </h2>
        {status === "loading" ? (
          <Spinner size="lg" />
        ) : (
          <Alert color={status === "success" ? "success" : "failure"}>
            {status === "success" ? message : errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
