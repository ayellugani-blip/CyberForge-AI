const RSSParser = require("rss-parser");
const News = require("../models/News");
const parser = new RSSParser();

const FEEDS = [
    { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", category: "News" },
    { name: "ThreatPost", url: "https://threatpost.com/feed/", category: "News" } // Fallback/Secondary
];

const syncLiveNews = async () => {
    console.log("📡 Synchronizing Intelligence Feeds...");

    for (const feed of FEEDS) {
        try {
            const feedData = await parser.parseURL(feed.url);
            console.log(`✅ Loaded ${feedData.items.length} items from ${feed.name}`);

            for (const item of feedData.items) {
                try {
                    // Check if already exists to avoid duplicates (link is unique)
                    await News.findOneAndUpdate(
                        { link: item.link },
                        {
                            title: item.title,
                            description: item.contentSnippet || item.content || "Read more at the source.",
                            link: item.link,
                            pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }),
                            source: feed.name,
                            category: feed.category,
                            trendingScore: Math.floor(Math.random() * 50) + 50, // 50-100 for recent items
                            createdAt: new Date(item.pubDate)
                        },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                } catch (innerErr) {
                    // Unique constraint might trigger, skip silently
                }
            }
        } catch (err) {
            console.error(`❌ Failed to fetch from ${feed.name}:`, err.message);
        }
    }

    console.log("🏁 Intelligence Synchronization Complete.");
};

module.exports = { syncLiveNews };
