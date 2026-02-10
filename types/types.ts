export interface PartyStats {
  party: string;
  tweetCount: number;
  averageLikes: number;
  averageEngagement: number;
  totalAccounts: number;
}

export interface Tweet {
  id: string;
  text: string;
  author: string;
  party: string;
  likes: number;
  retweets: number;
  replies: number;
  engagement: number;
  createdAt: string;
  url: string;
}

export interface AccountSummary {
  id: string;
  username: string;
  displayName: string;
  party: string;
  followerCount: number;
  tweetCount: number;
  averageLikes: number;
}

export interface DashboardData {
  parties: PartyStats[];
  totalAccounts: number;
  totalTweets: number;
  averageLikes: number;
  averageEngagement: number;
}

export type PartyFilter = "Hadash-Ta'al" | "Ra'am" | "Islamic / Independent" | "Activists";
