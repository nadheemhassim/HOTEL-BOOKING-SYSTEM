export default function PromoCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="relative h-48 sm:h-56 bg-gray-200" />
      
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>

        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded" />
          ))}
        </div>

        <div className="flex justify-between">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}