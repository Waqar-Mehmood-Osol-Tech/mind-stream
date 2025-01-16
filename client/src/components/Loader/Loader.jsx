const Loader = () => {
  return (
    <div className="flex bg-gradient-to-b from-purple-50 to-white items-center justify-center h-screen bg-white">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-800 border-b-purple-600 rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 border-4 border-violet-200 border-t-violet-900 border-b-violet-700 rounded-full animate-spin [animation-duration:2s]"></div>
      </div>
    </div>
  );
};

export default Loader;
