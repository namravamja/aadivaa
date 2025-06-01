"use client";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function LoadingSkeleton({
  className = "",
  lines = 1,
  height = "h-4",
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-stone-200 rounded ${height} ${
            index < lines - 1 ? "mb-2" : ""
          }`}
        />
      ))}
    </div>
  );
}

export function FormLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <LoadingSkeleton height="h-4" className="mb-2 w-24" />
            <LoadingSkeleton height="h-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddressLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="border border-stone-200 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <LoadingSkeleton height="h-5" className="mb-2 w-32" />
              <LoadingSkeleton lines={4} className="w-full" />
            </div>
            <div className="flex gap-2 ml-4">
              <LoadingSkeleton height="h-8" className="w-8" />
              <LoadingSkeleton height="h-8" className="w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
