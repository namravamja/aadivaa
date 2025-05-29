export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-stone-200 aspect-square mb-4"></div>
          <div className="bg-stone-200 h-5 w-2/3 mb-2"></div>
          <div className="bg-stone-200 h-4 w-1/2 mb-2"></div>
          <div className="bg-stone-200 h-4 w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
