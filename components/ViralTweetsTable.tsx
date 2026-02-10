"use client";

import { useState } from "react";
import { PartyFilter, Tweet } from "@/types/types";

interface ViralTweetsTableProps {
  tweets: Tweet[];
}

type SortKey = "likes" | "retweets" | "replies";

const TOP_N_OPTIONS = [5, 10, 20, 30] as const;
type TopN = (typeof TOP_N_OPTIONS)[number];

const PARTY_OPTIONS: Array<"all" | PartyFilter> = [
  "all",
  "Hadash-Ta'al",
  "Ra'am",
  "Islamic / Independent",
  "Activists",
];

export default function ViralTweetsTable({ tweets }: ViralTweetsTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("likes");
  const [partyFilter, setPartyFilter] = useState<"all" | PartyFilter>("all");
  const [topN, setTopN] = useState<TopN>(10);

  const filteredTweets =
    partyFilter === "all"
      ? tweets
      : tweets.filter((tweet) => tweet.party === partyFilter);

  const sortedTweets = [...filteredTweets].sort(
    (a, b) => b[sortBy] - a[sortBy]
  );
  const displayedTweets = sortedTweets.slice(0, topN);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Viral Tweets
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore the most engaged tweets and slice them by party and
            engagement type.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1 dark:text-gray-300">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            >
              <option value="likes">Likes</option>
              <option value="retweets">Retweets</option>
              <option value="replies">Replies</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1 dark:text-gray-300">
              Party
            </label>
            <select
              value={partyFilter}
              onChange={(e) =>
                setPartyFilter(e.target.value as "all" | PartyFilter)
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            >
              {PARTY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All parties" : option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1 dark:text-gray-300">
              Show top
            </label>
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value) as TopN)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            >
              {TOP_N_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4 dark:text-gray-400">
        Showing top {displayedTweets.length} of {sortedTweets.length.toLocaleString()} tweets.
      </div>

      <div className="overflow-x-auto max-h-[60vh]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                Tweet
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                Author
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                Party
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                Likes
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                Retweets
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                Replies
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedTweets.map((tweet) => (
              <tr
                key={tweet.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/40"
              >
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 max-w-xl">
                  <div className="line-clamp-3">{tweet.text}</div>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {tweet.author}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {tweet.party}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                  {tweet.likes.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                  {tweet.retweets.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                  {tweet.replies.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

