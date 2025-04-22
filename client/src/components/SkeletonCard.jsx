export default function SkeletonCard() {
    return (
      <div className="animate-pulse bg-white p-4 rounded-lg shadow-md">
        <div className="w-full h-48 bg-gray-300 rounded-md"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mt-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
        <div className="h-8 bg-gray-300 rounded w-full mt-4"></div>
      </div>
    )
  }
  