"use client";

import { PartyFilter } from "@/types/types";

interface SidebarFiltersProps {
  selectedParties: PartyFilter[];
  onPartyFilterChange: (parties: PartyFilter[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const PARTIES: PartyFilter[] = [
  "Hadash-Ta'al",
  "Ra'am",
  "Islamic / Independent",
  "Activists",
];

export default function SidebarFilters({
  selectedParties,
  onPartyFilterChange,
  dateRange,
  onDateRangeChange,
}: SidebarFiltersProps) {
  const handlePartyToggle = (party: PartyFilter) => {
    if (selectedParties.includes(party)) {
      onPartyFilterChange(selectedParties.filter((p) => p !== party));
    } else {
      onPartyFilterChange([...selectedParties, party]);
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto dark:bg-gray-900 dark:border-gray-800 z-40">
      <div className="p-4 sm:p-6">
        {/* Logo/Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Twitter/X Political Analytics
          </h1>
        </div>

        {/* Party Filter */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 dark:text-gray-200">
            Party Filter
          </h2>
          <div className="space-y-1.5 sm:space-y-2">
            {PARTIES.map((party) => (
              <label
                key={party}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1.5 sm:p-2 rounded dark:hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedParties.includes(party)}
                  onChange={() => handlePartyToggle(party)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                  {party}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-2">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 dark:text-gray-200">
            Date Range
          </h2>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="last-year">Last year</option>
            <option value="all-time">All time</option>
          </select>
        </div>
      </div>
    </div>
  );
}
