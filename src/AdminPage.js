export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Admin can manage products, users, and reviews here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">Users: 12</div>
        <div className="bg-white p-5 rounded-xl shadow">Products: 25</div>
        <div className="bg-white p-5 rounded-xl shadow">Reviews: 40</div>
      </div>
    </div>
  );
}