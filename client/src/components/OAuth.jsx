import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { signInSuccess } from "../redux/user/userSlice.js";

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/auth/google`,
        {
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleClick}
        className="flex items-center justify-center w-full mb-4 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        <img
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
          alt="Google icon"
          className="w-6 h-6 mr-2"
        />
        Continue with Google
      </button>
    </div>
  );
}

export default OAuth;
