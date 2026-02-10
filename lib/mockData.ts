import { AccountSummary, DashboardData, PartyStats, Tweet } from "@/types/types";
import allTweetsData from "@/data/all_tweets.json";

interface RawTweet {
  id: string;
  url: string;
  username: string;
  display_name: string;
  group: string;
  label: string;
  text: string;
  created_at: string;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  virality_score: number;
}

// Map data group names to filter names
const GROUP_MAP: Record<string, string> = {
  "Hadash-Ta'al": "Hadash-Ta'al",
  "Ra'am": "Ra'am",
  "Islamic/Independent": "Islamic / Independent",
  "Activist": "Activists",
};

function normalizeGroupName(group: string): string {
  return GROUP_MAP[group] || group;
}

export function getViralTweets(): Tweet[] {
  const tweets = allTweetsData as RawTweet[];

  return tweets.map((tweet) => ({
    id: tweet.id,
    text: tweet.text,
    author: tweet.display_name || tweet.username,
    party: normalizeGroupName(tweet.group),
    likes: tweet.likes,
    retweets: tweet.retweets,
    replies: tweet.replies,
    engagement: tweet.virality_score,
    createdAt: tweet.created_at,
    url: tweet.url,
  }));
}

export function getTweetsByUsername(username: string): Tweet[] {
  const tweets = allTweetsData as RawTweet[];
  const usernameLower = username.toLowerCase();

  return tweets
    .filter((tweet) => tweet.username.toLowerCase() === usernameLower)
    .map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      author: tweet.display_name || tweet.username,
      party: normalizeGroupName(tweet.group),
      likes: tweet.likes,
      retweets: tweet.retweets,
      replies: tweet.replies,
      engagement: tweet.virality_score,
      createdAt: tweet.created_at,
      url: tweet.url,
    }))
    .sort((a, b) => {
      // Sort by date, most recent first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function getDashboardData(): DashboardData {
  const tweets = allTweetsData as RawTweet[];

  // Group tweets by party
  const partyMap = new Map<string, {
    tweets: RawTweet[];
    accounts: Set<string>;
    totalLikes: number;
    totalEngagement: number;
  }>();

  tweets.forEach((tweet) => {
    const normalizedGroup = normalizeGroupName(tweet.group);
    
    if (!partyMap.has(normalizedGroup)) {
      partyMap.set(normalizedGroup, {
        tweets: [],
        accounts: new Set(),
        totalLikes: 0,
        totalEngagement: 0,
      });
    }

    const partyData = partyMap.get(normalizedGroup)!;
    partyData.tweets.push(tweet);
    partyData.accounts.add(tweet.username);
    partyData.totalLikes += tweet.likes;
    partyData.totalEngagement += tweet.virality_score;
  });

  // Convert to PartyStats array
  const parties: PartyStats[] = Array.from(partyMap.entries()).map(([party, data]) => {
    const tweetCount = data.tweets.length;
    const totalAccounts = data.accounts.size;
    const averageLikes = tweetCount > 0 ? Math.round(data.totalLikes / tweetCount) : 0;
    const averageEngagement = tweetCount > 0 ? Math.round(data.totalEngagement / tweetCount) : 0;

    return {
      party,
      tweetCount,
      averageLikes,
      averageEngagement,
      totalAccounts,
    };
  });

  // Calculate overall metrics
  const totalAccounts = Array.from(partyMap.values()).reduce(
    (sum, data) => sum + data.accounts.size,
    0
  );
  const totalTweets = tweets.length;
  const averageLikes = totalTweets > 0
    ? Math.round(tweets.reduce((sum, t) => sum + t.likes, 0) / totalTweets)
    : 0;
  const averageEngagement = totalTweets > 0
    ? Math.round(tweets.reduce((sum, t) => sum + t.virality_score, 0) / totalTweets)
    : 0;

  return {
    parties,
    totalAccounts,
    totalTweets,
    averageLikes,
    averageEngagement,
  };
}

export function getAccountSummaries(): AccountSummary[] {
  const tweets = allTweetsData as RawTweet[];

  type AccAgg = {
    displayName: string;
    group: string;
    tweetCount: number;
    totalLikes: number;
  };

  const accountMap = new Map<string, AccAgg>();

  tweets.forEach((tweet) => {
    const usernameKey = tweet.username.toLowerCase();
    const normalizedGroup = normalizeGroupName(tweet.group);

    const existing = accountMap.get(usernameKey);
    if (!existing) {
      accountMap.set(usernameKey, {
        displayName: tweet.display_name || tweet.username,
        group: normalizedGroup,
        tweetCount: 1,
        totalLikes: tweet.likes,
      });
    } else {
      existing.tweetCount += 1;
      existing.totalLikes += tweet.likes;
    }
  });

  const accounts: AccountSummary[] = Array.from(accountMap.entries()).map(
    ([username, data]) => {
      const averageLikes =
        data.tweetCount > 0
          ? Math.round(data.totalLikes / data.tweetCount)
          : 0;

      return {
        id: username,
        username,
        displayName: data.displayName,
        party: data.group,
        followerCount: 0,
        tweetCount: data.tweetCount,
        averageLikes,
      };
    }
  );

  // Sort by party then display name for a stable, readable table
  accounts.sort((a, b) => {
    if (a.party === b.party) {
      return a.displayName.localeCompare(b.displayName);
    }
    return a.party.localeCompare(b.party);
  });

  return accounts;
}

export interface TopicNarrativeData {
  username: string;
  display_name: string;
  group: string;
  top_topics: string[];
  narratives: string[];
}

export function getTopicsAndNarratives(): TopicNarrativeData[] {
  try {
    const data = require("@/data/topics_and_narratives.json");
    // Convert object keyed by username to array
    return Object.values(data) as TopicNarrativeData[];
  } catch (error) {
    console.warn("Failed to load topics and narratives:", error);
    return [];
  }
}

export interface PartyComparisonData {
  party: string;
  leadingTopics: string[];
  narratives: string[];
  viralTweets: Tweet[];
}

// Map data group names to filter names
const TOPICS_GROUP_MAP: Record<string, string> = {
  "Hadash-Ta'al": "Hadash-Ta'al",
  "Ra'am": "Ra'am",
  "Islamic/Independent": "Islamic / Independent",
  "Activist": "Activists",
};

function normalizeTopicsGroup(group: string): string {
  return TOPICS_GROUP_MAP[group] || group;
}

export function getPartyComparisonData(): PartyComparisonData[] {
  const allTopicsNarratives = getTopicsAndNarratives();
  const allTweets = getViralTweets();

  // Group topics/narratives by party
  const partyTopicsMap = new Map<string, { topics: string[]; narratives: string[] }>();

  allTopicsNarratives.forEach((item) => {
    const party = normalizeTopicsGroup(item.group);
    
    if (!partyTopicsMap.has(party)) {
      partyTopicsMap.set(party, { topics: [], narratives: [] });
    }
    
    const partyData = partyTopicsMap.get(party)!;
    partyData.topics.push(...item.top_topics);
    partyData.narratives.push(...item.narratives);
  });

  // Get most viral tweets per party (top 3 by engagement)
  const partyTweetsMap = new Map<string, Tweet[]>();
  
  allTweets.forEach((tweet) => {
    const party = tweet.party;
    if (!partyTweetsMap.has(party)) {
      partyTweetsMap.set(party, []);
    }
    partyTweetsMap.get(party)!.push(tweet);
  });

  // Aggregate and process data for each party
  const parties: PartyComparisonData[] = Array.from(partyTopicsMap.keys()).map((party) => {
    const partyData = partyTopicsMap.get(party)!;
    
    // Count topic frequency and get top 5
    const topicCounts = new Map<string, number>();
    partyData.topics.forEach((topic) => {
      const normalized = topic.toLowerCase().trim();
      topicCounts.set(normalized, (topicCounts.get(normalized) || 0) + 1);
    });
    
    const leadingTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => {
        // Find original capitalization
        const original = partyData.topics.find(
          (t) => t.toLowerCase().trim() === topic
        );
        return original || topic;
      });

    // Get unique narratives (remove exact duplicates)
    const uniqueNarratives = Array.from(new Set(partyData.narratives));

    // Get top 3 viral tweets by engagement
    const partyTweets = partyTweetsMap.get(party) || [];
    const viralTweets = [...partyTweets]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);

    return {
      party,
      leadingTopics: leadingTopics.length > 0 ? leadingTopics : ["No topics available"],
      narratives: uniqueNarratives.length > 0 ? uniqueNarratives : ["No narratives available"],
      viralTweets,
    };
  });

  // Sort by party name for consistent display
  parties.sort((a, b) => a.party.localeCompare(b.party));

  return parties;
}
