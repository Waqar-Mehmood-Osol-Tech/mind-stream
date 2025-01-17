const TermsOfService = () => {
  return (
    <div className="bg-purple-100 min-h-screen mt-16 flex items-center justify-center px-6">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Terms of Service
        </h2>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">1.</span> By accessing this
          platform, you agree to comply with all applicable laws and
          regulations.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">2.</span> You must be at
          least 18 years old or have parental consent to use our services.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">3.</span> Any misuse of the
          platform, such as hacking, unauthorized access, or distribution of
          malware, is strictly prohibited.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">4.</span> All intellectual
          property on this platform belongs to us unless otherwise stated.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">5.</span> We are not liable
          for user-generated content; users bear full responsibility for their
          posts.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">6.</span> We reserve the
          right to suspend or terminate accounts that violate our policies.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">7.</span> Users are
          responsible for maintaining the confidentiality of their account
          credentials.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">8.</span> Third-party links
          on the platform are provided for convenience; we are not responsible
          for their content or security.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">9.</span> Refunds or
          cancellations will be handled per our refund policy, if applicable.
        </p>
        <p className="text-gray-700 leading-8 mb-4">
          <span className="text-purple-900 font-bold">10.</span> These terms may
          be updated periodically; continued use implies acceptance of changes.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
