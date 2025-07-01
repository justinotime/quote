export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#191b22] mb-4"></div>
        <p className="text-lg text-[#7e828f]">Loading...</p>
      </div>
    </div>
  );
} 