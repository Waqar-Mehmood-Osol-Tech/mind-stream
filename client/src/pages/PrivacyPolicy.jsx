import React, { useState } from "react";

const PrivacyPolicy = () => {
  const [showMore, setShowMore] = useState(false);

  const handleLearnMore = () => {
    setShowMore(true); // Show additional points and hide the button
  };

  return (
    <div className="bg-purple-100 min-h-screen mt-16 flex items-center justify-center px-6">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Privacy Policy
        </h2>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">1.</span> We collect{" "}
          <span className="italic text-purple-700">personal data</span> such as
          name, email, and preferences to enhance your experience.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">2.</span> Your information
          is used for personalization, account management, and improving
          services.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">3.</span> We ensure your
          data is kept secure with{" "}
          <span className="italic text-purple-700">
            industry-standard encryption.
          </span>
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">4.</span> Cookies and{" "}
          <span className="italic text-purple-700">analytics tools</span> are
          used to understand user behavior and optimize the platform.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">5.</span> Users have full
          rights to access, modify, or delete their{" "}
          <span className="italic text-purple-700">personal information.</span>
        </p>

        {/* Show additional points when "Learn More" is clicked */}
        {showMore && (
          <>
            <p className="text-gray-700 leading-8 mb-4">
              <span className="text-purple-900 font-bold">6.</span> Data is never
              shared with third parties without explicit consent.
            </p>
            <p className="text-gray-700 leading-8 mb-4">
              <span className="text-purple-900 font-bold">7.</span> We adhere to
              strict <span className="italic text-purple-700">GDPR</span>{" "}
              compliance guidelines.
            </p>
            <p className="text-gray-700 leading-8 mb-4">
              <span className="text-purple-900 font-bold">8.</span> Users can opt
              out of non-essential data collection at any time.
            </p>
            <p className="text-gray-700 leading-8 mb-4">
              <span className="text-purple-900 font-bold">9.</span> Transparency
              is key: updates to policies are communicated promptly.
            </p>
            <p className="text-gray-700 leading-8 mb-4">
              <span className="text-purple-900 font-bold">10.</span> Feedback and
              queries regarding our privacy practices are welcome.
            </p>
          </>
        )}

        {/* Learn More button, hidden after it's clicked */}
        {!showMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLearnMore}
              className="bg-purple-900 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              Learn More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
