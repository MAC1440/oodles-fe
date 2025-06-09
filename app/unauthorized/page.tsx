export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-black">You do not have permission to view this page.</p>
        <a href="/login" className="text-blue-500 underline mt-4 inline-block">Go to Login</a>
      </div>
    </div>
  );
}
