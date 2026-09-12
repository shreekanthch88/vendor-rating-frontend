const RecentActivities = ({ analytics }) => {
  const recentUsers = analytics?.recentUsers || [];
  const recentVendors = analytics?.recentVendors || [];

  const activities = [
    ...recentUsers.map((user) => ({
      text: `New user "${user.name}" registered`,
      date: user.createdAt,
    })),

    ...recentVendors.map((vendor) => ({
      text: `New vendor "${vendor.vendorName || vendor.name || "Vendor"}" added`,
      date: vendor.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-5">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500">
          No recent activities found.
        </p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="border-l-4 border-blue-600 pl-4"
            >
              <p>{activity.text}</p>

              <span className="text-xs text-gray-500">
                {new Date(activity.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivities;