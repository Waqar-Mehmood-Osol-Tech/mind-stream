/* eslint-disable react/prop-types */
// import { useState } from "react";
// import { ChevronRight } from 'lucide-react';

import { ChevronRight } from "lucide-react";
import { useState } from "react";

// export default function AdComponent({ position, imageUrl, onClose }) {
//   const [showWhyThis, setShowWhyThis] = useState(false);

//   return (
//     <div className="w-[300px] top-[80vh]">
//       <div className="bg-white shadow-lg rounded-sm p-2">
//         <div className="space-y-2">
//           {/* Ad Content */}
//           <div className="relative">
//             <img
//               src={imageUrl || "/placeholder.svg"}
//               alt="Advertisement"
//               className="w-full h-[400px] object-cover"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-2 text-xs text-gray-500">
//               Ads by Google
//             </div>
//           </div>

//           {/* Ad Controls */}
//           <div className="space-y-1">
//             <button
//               onClick={() => onClose(position)}
//               className="w-full py-2 px-4 text-sm font-medium text-white bg-[#4285f4] hover:bg-[#3367d6] transition-colors rounded"
//             >
//               Stop seeing this ad
//             </button>

//             <button
//               onClick={() => setShowWhyThis(!showWhyThis)}
//               className="w-full flex items-center justify-between py-1 px-4 text-sm text-[#4285f4] hover:bg-gray-50 transition-colors rounded"
//             >
//               <span>Why this ad?</span>
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>

//           {/* Why This Ad Dropdown */}
//           {showWhyThis && (
//             <div className="p-3 text-sm text-gray-600 border-t">
//               <p>This ad was shown to you based on your interests and other information.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// AdComponent.jsx
const AdComponent = ({ position, imageUrl, onClose, onShow, isVisible }) => {
  const [showWhyThis, setShowWhyThis] = useState(false);
  return (
    <div
      className={`w-[300px] h-[400px] top-[80vh] bg-gray-200 flex flex-col items-center justify-center shadow-xl`}
    >
      {isVisible ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={`${position} Ad`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-2 text-xs text-gray-500">
            Ads by Google
          </div>
          {/* <button
            className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded"
            onClick={() => onClose(position)}
          >
            Stop seeing this
          </button> */}
          <div className="space-y-1">
            <button
              onClick={() => onClose(position)}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-[#4285f4] hover:bg-[#3367d6] transition-colors"
            >
              Stop seeing this ad
            </button>

            <button
              onClick={() => setShowWhyThis(!showWhyThis)}
              className="w-full flex items-center justify-between bh-gray-200 py-1 px-4 text-sm text-[#4285f4] shadow-xl hover:bg-gray-50 transition-colors "
            >
              <span>Why this ad?</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Why This Ad Dropdown */}
          {showWhyThis && (
            <div className="p-3 text-sm bg-gray-200 text-gray-600 border-t">
              <p>
                This ad was shown to you based on your interests and other
                information.
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => onShow(position)}
        >
          See the Ad
        </button>
      )}
    </div>
  );
};

export default AdComponent;
