"use client";

import { PartyComparisonData } from "@/lib/mockData";
import { PartyFilter } from "@/types/types";

interface CrossPartyComparisonProps {
  data: PartyComparisonData[];
  selectedParties: PartyFilter[];
}

const PARTY_COLORS: Record<string, string> = {
  "Hadash-Ta'al": "border-red-500 bg-red-50 dark:bg-red-900/20",
  "Ra'am": "border-green-500 bg-green-50 dark:bg-green-900/20",
  "Islamic / Independent": "border-teal-500 bg-teal-50 dark:bg-teal-900/20",
  Activists: "border-violet-500 bg-violet-50 dark:bg-violet-900/20",
};

const PARTY_TEXT_COLORS: Record<string, string> = {
  "Hadash-Ta'al": "text-red-700 dark:text-red-300",
  "Ra'am": "text-green-700 dark:text-green-300",
  "Islamic / Independent": "text-teal-700 dark:text-teal-300",
  Activists: "text-violet-700 dark:text-violet-300",
};

export default function CrossPartyComparison({
  data,
  selectedParties,
}: CrossPartyComparisonProps) {
  // Filter data by selected parties
  const filteredData = data.filter((item) =>
    selectedParties.includes(item.party as PartyFilter)
  );

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center dark:bg-gray-800 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-300">
          No party data available for selected parties.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">
          Cross-Party Comparison
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Compare leading topics, narratives, and viral tweets across parties
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredData.map((partyData) => {
          const borderColor = PARTY_COLORS[partyData.party] || "border-gray-500 bg-gray-50";
          const textColor = PARTY_TEXT_COLORS[partyData.party] || "text-gray-700";

          return (
            <div
              key={partyData.party}
              className={`bg-white rounded-lg shadow-sm border-2 ${borderColor} p-6 dark:bg-gray-800 flex flex-col`}
            >
              {/* Party Header */}
              <h3 className={`text-xl font-bold mb-6 ${textColor}`}>
                {partyData.party}
              </h3>

              <div className="flex-1 space-y-6">
                {/* Leading Topics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-300">
                    Leading Topics
                  </h4>
                  <ul className="space-y-2">
                    {partyData.leadingTopics.map((topic, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className={`mr-2 ${textColor} font-medium`}>
                          {index + 1}.
                        </span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Narratives */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-300">
                    Key Narratives
                  </h4>
                  <ul className="space-y-3">
                    {partyData.narratives.map((narrative, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                      >
                        {narrative}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Most Viral Tweets */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-300">
                    Most Viral Tweets
                  </h4>
                  <div className="space-y-3">
                    {partyData.viralTweets.length === 0 ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        No tweets available
                      </p>
                    ) : (
                      partyData.viralTweets.map((tweet, index) => (
                        <div
                          key={tweet.id}
                          className="border border-gray-200 rounded p-3 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40"
                        >
                          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                            {tweet.text}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">
                              {tweet.engagement.toLocaleString()} engagement
                            </span>
                            <div className="flex items-center space-x-2">
                              <span>❤️ {tweet.likes.toLocaleString()}</span>
                              <span>🔄 {tweet.retweets.toLocaleString()}</span>
                            </div>
                          </div>
                          {tweet.url && (
                            <a
                              href={tweet.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block dark:text-blue-400"
                            >
                              View →
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
