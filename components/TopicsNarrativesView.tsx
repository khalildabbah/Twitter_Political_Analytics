"use client";

import { PartyFilter } from "@/types/types";
import { TopicNarrativeData } from "@/lib/mockData";

interface TopicsNarrativesViewProps {
  data: TopicNarrativeData[];
  selectedParties: PartyFilter[];
}

// Map data group names to filter names
const GROUP_MAP: Record<string, PartyFilter> = {
  "Hadash-Ta'al": "Hadash-Ta'al",
  "Ra'am": "Ra'am",
  "Islamic/Independent": "Islamic / Independent",
  "Activist": "Activists",
};

function normalizeGroup(group: string): PartyFilter | null {
  return GROUP_MAP[group] || null;
}

export default function TopicsNarrativesView({
  data,
  selectedParties,
}: TopicsNarrativesViewProps) {
  // Filter by selected parties
  const filteredData = data.filter((item) => {
    const normalized = normalizeGroup(item.group);
    return normalized && selectedParties.includes(normalized);
  });

  // Group by party
  const groupedByParty = filteredData.reduce(
    (acc, item) => {
      const party = normalizeGroup(item.group) || "Unknown";
      if (!acc[party]) {
        acc[party] = [];
      }
      acc[party].push(item);
      return acc;
    },
    {} as Record<string, TopicNarrativeData[]>
  );

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center dark:bg-gray-800 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-300">
          No topics and narratives data available for selected parties.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByParty)
        .sort()
        .map(([party, accounts]) => (
          <div
            key={party}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-gray-100">
              {party}
            </h2>
            <div className="space-y-8">
              {accounts.map((account) => (
                <div key={account.username} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0 dark:border-gray-700">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {account.display_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{account.username}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Top Topics */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-300">
                        Top Topics
                      </h4>
                      <ul className="space-y-2">
                        {account.top_topics.map((topic, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <span className="text-blue-500 dark:text-blue-400 mt-1">
                              •
                            </span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Narratives */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-300">
                        Recurring Narratives
                      </h4>
                      <ul className="space-y-3">
                        {account.narratives.map((narrative, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                          >
                            {narrative}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
