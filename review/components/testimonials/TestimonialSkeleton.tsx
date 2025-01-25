import { User } from 'lucide-react';

export default function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100/50 animate-pulse">
      {/* Rating */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
        ))}
      </div>

      {/* Review Text */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-[#1B4D3E]/5 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-300" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-2 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
} 