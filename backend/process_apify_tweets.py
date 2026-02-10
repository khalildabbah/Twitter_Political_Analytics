"""
Convert Apify Tweet Scraper V2 JSON output into a normalized dataset
for the Next.js Twitter/X Political Analytics Dashboard.

This script reads raw tweet data from Apify's scraper and normalizes it
into a clean format that the dashboard can consume.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd


# List of accounts to match against (same as in scrape_tweets.py)
ACCOUNTS: List[Dict[str, str]] = [
    # =========================
    # Hadash–Ta'al
    # =========================
    {"handle": "AyOdeh", "group": "Hadash-Ta'al", "label": "Ayman Odeh"},
    {"handle": "Ahmad_tibi", "group": "Hadash-Ta'al", "label": "Ahmad Tibi"},
    {"handle": "AidaTuma", "group": "Hadash-Ta'al", "label": "Aida Touma-Sliman"},
    {"handle": "ofercass", "group": "Hadash-Ta'al", "label": "Ofer Cassif"},
    {"handle": "DrJabareen", "group": "Hadash-Ta'al", "label": "Yousef Jabareen"},

    # =========================
    # Ra'am
    # =========================
    {"handle": "mnsorabbas", "group": "Ra'am", "label": "Mansour Abbas"},
    {"handle": "Waleedt68", "group": "Ra'am", "label": "Waleed Taha"},
    {"handle": "WalidAlhwashla", "group": "Ra'am", "label": "Walid Al-Hawashla"},
    {"handle": "IbrahimSarsour", "group": "Ra'am", "label": "Ibrahim Sarsour"},
    {"handle": "TalalAlkrinawi", "group": "Ra'am", "label": "Talal Al-Qrenawi"},

    # =========================
    # Islamic Movement / Independents
    # =========================
    {"handle": "RaedSalah", "group": "Islamic/Independent", "label": "Sheikh Raed Salah"},
    {"handle": "MasarwaAmna", "group": "Islamic/Independent", "label": "Amna Masarwa"},
    {"handle": "HassanJabareen", "group": "Islamic/Independent", "label": "Hassan Jabareen"},
    {"handle": "SuhailDiab", "group": "Islamic/Independent", "label": "Suhail Diab"},

    # =========================
    # Activists (outside parties)
    # =========================
    {"handle": "SSinijlawi", "group": "Activist", "label": "Sawsan Sinijlawi"},
    {"handle": "HowidyHamza", "group": "Activist", "label": "Hamza Howidy"},
    {"handle": "YousefMunayyer", "group": "Activist", "label": "Yousef Munayyer"},
    {"handle": "LeanneMohamad", "group": "Activist", "label": "Leanne Mohamad"},
    {"handle": "HaneenZoabi", "group": "Activist", "label": "Haneen Zoabi"},
]


def extract_username_from_url(url: str) -> str:
    """
    Extract the Twitter/X username from a tweet URL.
    
    Example: "https://x.com/DrJabareen/status/1387816255466446860" -> "DrJabareen"
    
    Parameters
    ----------
    url : str
        The tweet URL (e.g., "https://x.com/username/status/...")
    
    Returns
    -------
    str
        The username (handle) extracted from the URL
    """
    # Split on "/" and take the 4th segment (index 3)
    # https://x.com/<handle>/status/...
    parts = url.split("/")
    if len(parts) > 3:
        return parts[3]
    return ""


def load_raw_tweets(path: str) -> List[Dict[str, Any]]:
    """
    Load raw tweet data from Apify JSON file.
    
    Parameters
    ----------
    path : str
        Path to the Apify JSON file (e.g., "data/apify_raw_tweets.json")
    
    Returns
    -------
    List[Dict[str, Any]]
        List of raw tweet dictionaries
    """
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def normalize_tweets(raw: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Normalize raw Apify tweet data into a clean DataFrame.
    
    For each tweet, extracts username from URL, looks up group/label,
    and creates a normalized record with all required fields.
    
    Parameters
    ----------
    raw : List[Dict[str, Any]]
        List of raw tweet dictionaries from Apify
    
    Returns
    -------
    pd.DataFrame
        Normalized DataFrame with columns: id, url, username, display_name,
        group, label, text, created_at, likes, retweets, replies, quotes,
        virality_score
    """
    # Build handle metadata lookup (lowercase for case-insensitive matching)
    HANDLE_META: Dict[str, Dict[str, str]] = {}
    for account in ACCOUNTS:
        handle_lower = account["handle"].lower()
        HANDLE_META[handle_lower] = {
            "group": account["group"],
            "label": account["label"],
        }
    
    records: List[Dict[str, Any]] = []
    
    for tweet in raw:
        # Extract username from URL
        url = tweet.get("url", "")
        username = extract_username_from_url(url)
        username_lower = username.lower()
        
        # Look up group and label (default to "Unknown" if not found)
        meta = HANDLE_META.get(username_lower, {"group": "Unknown", "label": "Unknown"})
        group = meta["group"]
        label = meta["label"]
        
        # Extract engagement metrics (default to 0 if missing)
        likes = tweet.get("likeCount", 0) or 0
        retweets = tweet.get("retweetCount", 0) or 0
        replies = tweet.get("replyCount", 0) or 0
        quotes = tweet.get("quoteCount", 0) or 0
        
        # Calculate virality score
        virality_score = likes + retweets + replies + quotes
        
        # Build normalized record
        record = {
            "id": str(tweet.get("id", "")),
            "url": url,
            "username": username,
            "display_name": label,
            "group": group,
            "label": label,
            "text": tweet.get("text", ""),
            "created_at": tweet.get("createdAt", ""),
            "likes": likes,
            "retweets": retweets,
            "replies": replies,
            "quotes": quotes,
            "virality_score": virality_score,
        }
        
        records.append(record)
    
    return pd.DataFrame(records)


def save_outputs(df: pd.DataFrame) -> None:
    """
    Save normalized DataFrame to CSV and JSON files in the data/ directory.
    
    Parameters
    ----------
    df : pd.DataFrame
        Normalized tweet DataFrame
    """
    # Ensure data/ directory exists
    data_dir = Path("data")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Save as CSV (UTF-8, no index)
    csv_path = data_dir / "all_tweets.csv"
    df.to_csv(csv_path, index=False, encoding="utf-8")
    print(f"Saved CSV to {csv_path}")
    
    # Save as JSON (pretty-printed array)
    json_path = data_dir / "all_tweets.json"
    records = df.to_dict(orient="records")
    with json_path.open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"Saved JSON to {json_path}")


def main() -> None:
    """Main entry point: load, normalize, and save tweet data."""
    # Load raw tweets
    raw_tweets = load_raw_tweets("data/apify_raw_tweets.json")
    print(f"Loaded {len(raw_tweets)} raw tweets from Apify JSON")
    
    # Normalize
    df = normalize_tweets(raw_tweets)
    print(f"Normalized {len(df)} tweets into DataFrame")
    
    # Save outputs
    save_outputs(df)
    print("Processing complete!")


if __name__ == "__main__":
    main()
