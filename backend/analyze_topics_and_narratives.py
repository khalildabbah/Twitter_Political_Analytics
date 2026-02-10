"""
Extract topics and recurring narratives from tweets using OpenAI API.

This script uses OpenAI's gpt-4o-mini model to perform qualitative analysis
of tweet content, identifying main topics and recurring narratives for each
account. Quantitative metrics (likes, retweets, etc.) are handled separately
in the dashboard.

The analysis is done in a neutral, descriptive manner without sentiment
analysis or opinion inference.
"""

from __future__ import annotations

import json
import os
import logging
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed. Run: pip install openai")
    exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()  # Load .env file if it exists
except ImportError:
    # python-dotenv not installed, that's okay - will use environment variables only
    pass


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# OpenAI model to use (gpt-4o-mini is the cheapest "mini" model)
MODEL = "gpt-4o-mini"

# Maximum tweets per account to analyze
MAX_TWEETS_PER_ACCOUNT = 30

# Maximum characters per tweet (to stay within token limits)
MAX_CHARS_PER_TWEET = 280

# System prompt for OpenAI
SYSTEM_PROMPT = """You are a political data analyst. Your task is to analyze public social media posts in a neutral, descriptive, and non-judgmental way. Do not express opinions, emotions, praise, or criticism. Do not infer sentiment or intent. Focus only on identifying recurring topics and messages based strictly on the provided content."""

# User prompt template
USER_PROMPT_TEMPLATE = """Analyze the following tweets from a single account. Identify:

1. The top 5 main topics discussed across these tweets as short noun phrases (2-5 words each, describing what is discussed rather than opinions).
2. 2-3 recurring narratives that summarize repeated messages or themes in neutral, analytical language.

Tweets:
{tweets}

Return your response in strict JSON format only, with exactly two keys:
- "top_topics": an array of exactly five strings
- "narratives": an array of two or three strings

Do not include any additional text, explanations, or formatting outside the JSON."""


def load_tweets(path: str) -> List[Dict[str, Any]]:
    """Load tweets from JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def group_tweets_by_username(tweets: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """Group tweets by username and sort by date (most recent first)."""
    grouped = defaultdict(list)
    
    for tweet in tweets:
        username = tweet.get("username", "").lower()
        if username:
            grouped[username].append(tweet)
    
    # Sort each account's tweets by date (most recent first)
    for username in grouped:
        tweets_list = grouped[username]
        tweets_list.sort(
            key=lambda t: _parse_date(t.get("created_at", "")),
            reverse=True
        )
    
    return dict(grouped)


def _parse_date(date_str: str) -> datetime:
    """Parse date string to datetime object for sorting."""
    # Try common date formats
    formats = [
        "%a %b %d %H:%M:%S %z %Y",  # "Thu Apr 29 17:09:14 +0000 2021"
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d %H:%M:%S",
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except (ValueError, TypeError):
            continue
    
    # Return epoch if parsing fails (will sort to beginning)
    return datetime.fromtimestamp(0)


def prepare_tweets_for_analysis(tweets: List[Dict[str, Any]]) -> str:
    """Prepare tweets text for analysis, truncating if needed."""
    texts = []
    total_chars = 0
    
    for tweet in tweets[:MAX_TWEETS_PER_ACCOUNT]:
        text = tweet.get("text", "").strip()
        if not text:
            continue
        
        # Truncate if too long
        if len(text) > MAX_CHARS_PER_TWEET:
            text = text[:MAX_CHARS_PER_TWEET] + "..."
        
        texts.append(text)
        total_chars += len(text)
        
        # Rough token limit check (1 token ≈ 4 chars, aim for ~8000 tokens max)
        if total_chars > 30000:  # Conservative limit
            break
    
    return "\n\n".join(texts)


def analyze_account_tweets(
    client: OpenAI,
    tweets_text: str,
    username: str
) -> Dict[str, Any] | None:
    """Call OpenAI API to analyze tweets for topics and narratives."""
    if not tweets_text.strip():
        logging.warning(f"No tweet text available for @{username}")
        return None
    
    user_prompt = USER_PROMPT_TEMPLATE.format(tweets=tweets_text)
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,  # Lower temperature for more consistent, analytical output
            response_format={"type": "json_object"},  # Force JSON response
        )
        
        content = response.choices[0].message.content
        if not content:
            logging.warning(f"Empty response from OpenAI for @{username}")
            return None
        
        # Parse JSON response
        result = json.loads(content)
        
        # Validate structure
        if "top_topics" not in result or "narratives" not in result:
            logging.warning(f"Invalid response structure for @{username}: {result}")
            return None
        
        # Ensure top_topics has exactly 5 items
        topics = result.get("top_topics", [])
        if len(topics) != 5:
            logging.warning(f"Expected 5 topics for @{username}, got {len(topics)}")
            # Pad or truncate to 5
            if len(topics) < 5:
                topics.extend([""] * (5 - len(topics)))
            else:
                topics = topics[:5]
        
        # Ensure narratives has 2-3 items
        narratives = result.get("narratives", [])
        if len(narratives) < 2:
            logging.warning(f"Expected 2-3 narratives for @{username}, got {len(narratives)}")
            narratives = narratives[:3] if narratives else [""]
        elif len(narratives) > 3:
            narratives = narratives[:3]
        
        return {
            "top_topics": topics,
            "narratives": narratives,
        }
        
    except json.JSONDecodeError as e:
        logging.warning(f"Failed to parse JSON response for @{username}: {e}")
        return None
    except Exception as e:
        logging.warning(f"OpenAI API error for @{username}: {e}")
        return None


def main() -> None:
    """Main entry point."""
    # Check for API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logging.error("OPENAI_API_KEY environment variable not set")
        logging.error("Set it with: export OPENAI_API_KEY='your-key-here'")
        exit(1)
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    
    # Load tweets
    data_path = Path(__file__).parent.parent / "data" / "all_tweets.json"
    if not data_path.exists():
        logging.error(f"Tweets file not found: {data_path}")
        exit(1)
    
    logging.info(f"Loading tweets from {data_path}")
    all_tweets = load_tweets(str(data_path))
    logging.info(f"Loaded {len(all_tweets)} tweets")
    
    # Group by username
    grouped_tweets = group_tweets_by_username(all_tweets)
    logging.info(f"Found {len(grouped_tweets)} unique accounts")
    
    # Analyze each account
    results: Dict[str, Dict[str, Any]] = {}
    
    for username, tweets in grouped_tweets.items():
        # Get account metadata from first tweet
        first_tweet = tweets[0]
        group = first_tweet.get("group", "Unknown")
        display_name = first_tweet.get("display_name", username)
        
        logging.info(f"Analyzing @{username} ({display_name}, {group})...")
        
        # Prepare tweets text
        tweets_text = prepare_tweets_for_analysis(tweets)
        
        # Call OpenAI API
        analysis = analyze_account_tweets(client, tweets_text, username)
        
        if analysis:
            results[username] = {
                "username": username,
                "display_name": display_name,
                "group": group,
                "top_topics": analysis["top_topics"],
                "narratives": analysis["narratives"],
            }
            logging.info(f"✓ Completed @{username}")
        else:
            logging.warning(f"✗ Failed to analyze @{username}, skipping")
    
    # Write results
    output_path = Path(__file__).parent.parent / "data" / "topics_and_narratives.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    logging.info(f"Analysis complete. Results written to {output_path}")
    logging.info(f"Successfully analyzed {len(results)} out of {len(grouped_tweets)} accounts")


if __name__ == "__main__":
    main()
