// src/components/DashboardCard.jsx
export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
      <div className="text-primary text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
