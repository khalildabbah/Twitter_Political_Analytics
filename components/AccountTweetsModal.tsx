"use client";

import { Tweet } from "@/types/types";

interface AccountTweetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  username: string;
  tweets: Tweet[];
}

export default function AccountTweetsModal({
  isOpen,
  onClose,
  accountName,
  username,
  tweets,
}: AccountTweetsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col dark:bg-gray-800 m-2 sm:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {accountName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              @{username} • {tweets.length} tweets
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tweets List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {tweets.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm dark:text-gray-400">
                No tweets found for this account.
              </p>
            ) : (
              tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/40 transition-colors"
                >
                  <p className="text-sm sm:text-base text-gray-900 mb-2 sm:mb-3 dark:text-gray-100 whitespace-pre-wrap break-words">
                    {tweet.text}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{tweet.likes.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        <span>{tweet.retweets.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{tweet.replies.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  {tweet.url && (
                    <a
                      href={tweet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block dark:text-blue-400"
                    >
                      View on X →
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
}
