"use client";

interface ComparisonData {
  accountId: string;
  handle: string;
  platform: string;
  currentMonth: {
    followers: number;
    date: string;
  };
  previousMonth: {
    followers: number;
    date: string;
  };
  growth: {
    absolute: number;
    percentage: number;
  };
}

function getPlatformIcon(platform: string): string {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "📷";
    case "twitter":
      return "𝕏";
    case "youtube":
      return "▶";
    case "tiktok":
      return "♪";
    case "facebook":
      return "f";
    case "linkedin":
      return "in";
    default:
      return "•";
  }
}

function getPlatformColor(platform: string): string {
  switch (platform.toLowerCase()) {
    case "instagram":
      return "from-pink-400 to-purple-600";
    case "twitter":
      return "from-blue-400 to-blue-600";
    case "youtube":
      return "from-red-400 to-red-600";
    case "tiktok":
      return "from-black to-gray-800";
    case "facebook":
      return "from-blue-600 to-blue-800";
    case "linkedin":
      return "from-blue-500 to-blue-700";
    default:
      return "from-gray-400 to-gray-600";
  }
}

export default function ComparisonCard({
  data,
}: {
  data: ComparisonData;
}) {
  const isPositive = data.growth.absolute >= 0;
  const growthColor = isPositive ? "text-green-600" : "text-red-600";
  const bgColor = isPositive ? "bg-green-50" : "bg-red-50";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Header with platform color */}
      <div className={`bg-gradient-to-r ${getPlatformColor(data.platform)} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">
              {data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}
            </p>
            <p className="text-lg font-bold">@{data.handle}</p>
          </div>
          <div className="text-4xl">{getPlatformIcon(data.platform)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Current Followers */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-1">Current Followers</p>
          <p className="text-4xl font-bold text-gray-900">
            {data.currentMonth.followers.toLocaleString()}
          </p>
        </div>

        {/* Growth Indicator */}
        <div className={`${bgColor} rounded-lg p-4 mb-6`}>
          <p className="text-gray-600 text-sm mb-2">Month-over-Month Growth</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${growthColor}`}>
              {isPositive ? "+" : ""}{data.growth.absolute.toLocaleString()}
            </span>
            <span className={`text-lg font-semibold ${growthColor}`}>
              {isPositive ? "+" : ""}{data.growth.percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Comparison Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">This Month:</span>
            <span className="font-semibold text-gray-900">
              {data.currentMonth.followers.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-600">Last Month:</span>
            <span className="font-semibold text-gray-900">
              {data.previousMonth.followers.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-6">
          {isPositive ? (
            <div className="bg-green-100 text-green-800 text-center py-2 rounded font-medium text-sm">
              📈 Growing Strong
            </div>
          ) : data.growth.absolute === 0 ? (
            <div className="bg-gray-100 text-gray-800 text-center py-2 rounded font-medium text-sm">
              ➡️ No Change
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 text-center py-2 rounded font-medium text-sm">
              📉 Declining
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
