"use client";

import { useState } from "react";
import { AccountSummary } from "@/types/types";
import { getTweetsByUsername } from "@/lib/mockData";
import AccountTweetsModal from "./AccountTweetsModal";

interface AccountsTableProps {
  accounts: AccountSummary[];
}

export default function AccountsTable({ accounts }: AccountsTableProps) {
  const [selectedAccount, setSelectedAccount] = useState<{
    name: string;
    username: string;
  } | null>(null);

  const handleNameClick = (account: AccountSummary) => {
    setSelectedAccount({
      name: account.displayName,
      username: account.username,
    });
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
  };

  const tweets = selectedAccount
    ? getTweetsByUsername(selectedAccount.username)
    : [];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">
          Accounts
        </h2>
        <div className="text-sm text-gray-500 mb-4 dark:text-gray-400">
          Showing {accounts.length} accounts from real tweet data. Click on a name to view their tweets.
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleNameClick(account)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      {account.displayName}
                    </button>
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

      {selectedAccount && (
        <AccountTweetsModal
          isOpen={!!selectedAccount}
          onClose={handleCloseModal}
          accountName={selectedAccount.name}
          username={selectedAccount.username}
          tweets={tweets}
        />
      )}
    </>
  );
}

