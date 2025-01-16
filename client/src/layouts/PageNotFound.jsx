import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import pageNotFound from "../assets/pagenotfound.png";

function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <img src={pageNotFound} className="w-42 h-52" alt="Page Not Found" />
      
      <Link to="/home">
        <button className="p-3 px-12 mt-12 bg-purple-900 rounded-xl text-white">
          Go To Homepage
        </button>
      </Link>
    </div>
  );
}

export default PageNotFound;
