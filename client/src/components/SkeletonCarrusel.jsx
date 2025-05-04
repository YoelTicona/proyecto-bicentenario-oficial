const SkeletonCarrusel = () => {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-full max-w-sm bg-white rounded-xl shadow animate-pulse p-4"
        >
          <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCarrusel;
