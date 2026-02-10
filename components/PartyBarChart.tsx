"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PartyBarChartProps {
  data: Array<{
    party: string;
    tweetCount: number;
  }>;
  title: string;
}

const PARTY_COLORS: Record<string, string> = {
  "Hadash-Ta'al": "#ef4444", // red-500
  "Ra'am": "#22c55e", // green-500
  "Islamic / Independent": "#14b8a6", // teal-500
  Activists: "#8b5cf6", // violet-500
};

function getPartyColor(party: string) {
  return PARTY_COLORS[party] ?? "#3b82f6"; // fallback blue-500
}

export default function PartyBarChart({ data, title }: PartyBarChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex-shrink-0 dark:text-gray-100">
        {title}
      </h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="party"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="tweetCount" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.party}
                  fill={getPartyColor(entry.party)}
                  stroke={getPartyColor(entry.party)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

