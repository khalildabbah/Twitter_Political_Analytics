interface KpiCardProps {
  title: string;
  value: string | number;
}

export default function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2 dark:text-gray-400">
        {title}
      </h3>
      <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
