"use client";

import { AccountSummary } from "@/types/types";

interface AccountsTableProps {
  accounts: AccountSummary[];
}

export default function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
        Accounts
      </h2>
      <div className="text-sm text-gray-500 mb-4 dark:text-gray-400">
        Showing {accounts.length} accounts from real tweet data.
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                Handle
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-200">
                Party / Group
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                Tweets
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                Avg. Likes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                  {account.displayName}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  @{account.username}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                  {account.party}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                  {account.tweetCount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                  {account.averageLikes.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

