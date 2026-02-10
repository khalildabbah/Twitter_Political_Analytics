"use client";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200 mb-4 sm:mb-6 dark:border-gray-700 overflow-x-auto">
      <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap
              ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
