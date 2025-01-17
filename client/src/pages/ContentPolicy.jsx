import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const ContentPolicy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const ReportForm = () => {
    const [state, handleSubmit] = useForm("xnnnyvbr");
    if (state.succeeded) {
      return (
        <div className="text-green-600 font-semibold">
          Thank you! Your report has been submitted.
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="author" className="block text-gray-700 font-semibold">
          Author Name
        </label>
        <input
          id="author"
          type="text"
          name="author"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <ValidationError prefix="Author" field="author" errors={state.errors} />

        <label htmlFor="profile" className="block text-gray-700 font-semibold">
          Author Profile Link
        </label>
        <input
          id="profile"
          type="url"
          name="profile"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <ValidationError
          prefix="Profile"
          field="profile"
          errors={state.errors}
        />

        <label htmlFor="post" className="block text-gray-700 font-semibold">
          Post Link
        </label>
        <input
          id="post"
          type="url"
          name="post"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <ValidationError prefix="Post" field="post" errors={state.errors} />

        <label htmlFor="concern" className="block text-gray-700 font-semibold">
          Concern Regarding the Post
        </label>
        <textarea
          id="concern"
          name="concern"
          required
          className="w-full px-3 py-2 border rounded-md"
        ></textarea>
        <ValidationError
          prefix="Concern"
          field="concern"
          errors={state.errors}
        />

        <button
          type="submit"
          disabled={state.submitting}
          className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded-md"
        >
          Submit Report
        </button>
      </form>
    );
  };

  return (
    <div className="bg-purple-100 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl bg-white mt-14 rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Content Policy
        </h2>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">1.</span> Users must not
          post content that violates community guidelines or platform rules.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">2.</span> Offensive,
          discriminatory, or hateful content is strictly prohibited.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">3.</span> Posting spam,
          fraudulent schemes, or malicious links is not allowed.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">4.</span> Respect
          copyright and intellectual property laws when sharing content.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">5.</span> Harassment,
          bullying, or intimidation of any user will not be tolerated.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">6.</span> Personal
          information of others, such as contact details, must not be shared
          without consent.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">7.</span> Explicit or
          adult content must be labeled appropriately and follow platform
          guidelines.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">8.</span> Users should
          report inappropriate content to help maintain a safe environment.
        </p>
        {/* <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">9.</span> Automated
          posting, bots, or scripts that disrupt normal usage are prohibited.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">10.</span> Content
          promoting self-harm, violence, or illegal activities is not permitted.
        </p> */}

        {/* Report Content Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleOpenModal}
            className="bg-purple-900 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Report Content
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white mt-14 w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Report Content
            </h3>
            <ReportForm />
            <button
              onClick={handleCloseModal}
              className="mt-4 text-gray-500 hover:text-gray-700 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPolicy;
