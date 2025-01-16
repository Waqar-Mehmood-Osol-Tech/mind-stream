// /* eslint-disable react/prop-types */
// import { CheckCircle, AlertCircle } from "lucide-react";
// import { useEffect } from "react";

// const Popup = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Background Overlay */}
//       <div
//         className="absolute inset-0 bg-black opacity-50"
//         onClick={onClose}
//       ></div>

//       {/* Popup Content */}
//       <div
//         className={`relative z-10 p-6 rounded-lg shadow-xl text-center max-w-sm w-full
//         ${type === "success" ? "bg-white" : "bg-white"}`}
//       >
//         {/* Icon */}
//         <div className="mb-4">
//           {type === "success" ? (
//             <CheckCircle size={48} className="text-green-400 mx-auto" />
//           ) : (
//             <AlertCircle size={48} className="text-red-500 mx-auto" />
//           )}
//         </div>

//         {/* Message */}
//         <div className="mb-6 text-lg font-medium">{message}</div>

//         {/* OK Button */}
//         <button
//           onClick={onClose}
//           className="px-4 py-2 bg-gray-200 text-black rounded-full font-semibold hover:bg-gray-500"
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Popup;

// /* eslint-disable react/prop-types */
// import { CheckCircle, AlertCircle } from "lucide-react";
// import { useEffect } from "react";

// const Popup = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Background Overlay */}
//       <div
//         className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
//         onClick={onClose}
//       ></div>

//       {/* Popup Content */}
//       <div
//         className={`relative z-10 p-6 rounded-xl shadow-2xl text-center max-w-sm w-full transform transition-transform duration-300
//         ${type === "success" ? "bg-gradient-to-br from-green-100 to-white" : "bg-gradient-to-br from-red-100 to-white"}`}
//       >
//         {/* Icon */}
//         <div className="mb-4">
//           {type === "success" ? (
//             <CheckCircle size={56} className="text-green-500 mx-auto" />
//           ) : (
//             <AlertCircle size={56} className="text-red-500 mx-auto" />
//           )}
//         </div>

//         {/* Message */}
//         <div className="mb-6 text-lg font-semibold text-gray-700">
//           {message}
//         </div>

//         {/* OK Button */}
//         <button
//           onClick={onClose}
//           className={`px-6 py-2 text-white rounded-full font-bold shadow-md
//           hover:shadow-lg transition-all duration-300
//           ${type === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Popup;

/* eslint-disable react/prop-types */
import { CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Popup = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100); 

  useEffect(() => {
    setIsVisible(true);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 2)); 
    }, 100);

    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false); 
    setTimeout(onClose, 300); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* Popup Content */}
      <div
        className={`relative z-10 p-6 rounded-xl shadow-2xl text-center max-w-sm w-full transform transition-all duration-300 
        ${isVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-6"} 
        ${
          type === "success"
            ? "bg-gradient-to-br from-green-100 to-white"
            : "bg-gradient-to-br from-red-100 to-white"
        }`}
      >
        {/* Icon */}
        <div className="mb-4">
          {type === "success" ? (
            <CheckCircle size={56} className="text-green-500 mx-auto" />
          ) : (
            <AlertCircle size={56} className="text-red-500 mx-auto" />
          )}
        </div>

        {/* Message */}
        <div className="mb-6 text-lg font-semibold text-gray-700">
          {message}
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-[100ms] ${
              type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* OK Button */}
        <button
          onClick={handleClose}
          className={`px-6 py-2 text-white rounded-full font-bold shadow-md 
          hover:shadow-lg transition-all duration-300 
          ${
            type === "success"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
