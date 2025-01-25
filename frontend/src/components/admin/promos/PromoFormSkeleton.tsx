export default function PromoFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
      
      <div>
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>

      <div>
        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>

      <div>
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="h-6 w-6 bg-gray-200 rounded" />
        <div className="h-6 w-6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}