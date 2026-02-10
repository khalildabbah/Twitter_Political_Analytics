"use client";

import { useState } from "react";
import SidebarFilters from "@/components/SidebarFilters";
import Tabs from "@/components/Tabs";
import KpiCard from "@/components/KpiCard";
import PartyBarChart from "@/components/PartyBarChart";
import ThemeToggle from "@/components/ThemeToggle";
import AccountsTable from "@/components/AccountsTable";
import ViralTweetsTable from "@/components/ViralTweetsTable";
import TopicsNarrativesView from "@/components/TopicsNarrativesView";
import CrossPartyComparison from "@/components/CrossPartyComparison";
import {
  getAccountSummaries,
  getDashboardData,
  getViralTweets,
  getTopicsAndNarratives,
  getPartyComparisonData,
} from "@/lib/mockData";
import { PartyFilter } from "@/types/types";

const TABS = [
  "Overview",
  "Accounts",
  "Topics & Narratives",
  "Viral Tweets",
  "Cross-Party Comparison",
];

const ALL_PARTIES: PartyFilter[] = [
  "Hadash-Ta'al",
  "Ra'am",
  "Islamic / Independent",
  "Activists",
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedParties, setSelectedParties] = useState<PartyFilter[]>(ALL_PARTIES);
  const [dateRange, setDateRange] = useState("last-30-days");

  const dashboardData = getDashboardData();
  const allAccounts = getAccountSummaries();
  const allTweets = getViralTweets();
  const topicsNarratives = getTopicsAndNarratives();
  const partyComparisonData = getPartyComparisonData();

  // Filter data based on selected parties
  const filteredParties = dashboardData.parties.filter((party) =>
    selectedParties.includes(party.party as PartyFilter)
  );

  // Calculate aggregated metrics from filtered data
  const totalAccounts = filteredParties.reduce(
    (sum, party) => sum + party.totalAccounts,
    0
  );
  const totalTweets = filteredParties.reduce(
    (sum, party) => sum + party.tweetCount,
    0
  );
  const averageLikes =
    filteredParties.length > 0
      ? Math.round(
          filteredParties.reduce((sum, party) => sum + party.averageLikes, 0) /
            filteredParties.length
        )
      : 0;
  const averageEngagement =
    filteredParties.length > 0
      ? Math.round(
          filteredParties.reduce(
            (sum, party) => sum + party.averageEngagement,
            0
          ) / filteredParties.length
        )
      : 0;

  // Prepare chart data
  const chartData = filteredParties.map((party) => ({
    party: party.party,
    tweetCount: party.tweetCount,
  }));

  // Prepare accounts data for Accounts tab (respect party filters)
  const filteredAccountsByParty = allAccounts.filter((account) =>
    selectedParties.includes(account.party as PartyFilter)
  );

  const filteredAccounts = filteredAccountsByParty;

  const filteredTweetsByParty = allTweets.filter((tweet) =>
    selectedParties.includes(tweet.party as PartyFilter)
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <SidebarFilters
        selectedParties={selectedParties}
        onPartyFilterChange={setSelectedParties}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-4 flex items-center justify-end">
            <ThemeToggle />
          </div>
          {/* Tabs */}
          <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          {activeTab === "Overview" && (
            <div className="space-y-6 flex flex-col h-[calc(100vh-200px)]">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
                <KpiCard title="Total Accounts" value={totalAccounts} />
                <KpiCard title="Total Tweets" value={totalTweets} />
                <KpiCard title="Average Likes" value={averageLikes} />
                <KpiCard title="Average Engagement" value={averageEngagement} />
              </div>

              {/* Bar Chart */}
              <div className="flex-1 min-h-0">
                <PartyBarChart
                  data={chartData}
                  title="Number of Tweets per Party"
                />
              </div>
            </div>
          )}

          {activeTab === "Accounts" && (
            <div className="space-y-6">
              <AccountsTable accounts={filteredAccounts} />
            </div>
          )}

          {activeTab === "Viral Tweets" && (
            <div className="space-y-6">
              <ViralTweetsTable tweets={filteredTweetsByParty} />
            </div>
          )}

          {activeTab === "Topics & Narratives" && (
            <div className="space-y-6">
              <TopicsNarrativesView
                data={topicsNarratives}
                selectedParties={selectedParties}
              />
            </div>
          )}

          {activeTab === "Cross-Party Comparison" && (
            <div className="space-y-6">
              <CrossPartyComparison
                data={partyComparisonData}
                selectedParties={selectedParties}
              />
            </div>
          )}

          {activeTab !== "Overview" &&
            activeTab !== "Accounts" &&
            activeTab !== "Viral Tweets" &&
            activeTab !== "Topics & Narratives" &&
            activeTab !== "Cross-Party Comparison" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-300">
                {activeTab} tab coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
