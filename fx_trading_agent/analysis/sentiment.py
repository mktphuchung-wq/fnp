"""Sentiment analysis for market news."""

from fx_trading_agent.data.news_fetcher import NewsItem


def score_headlines(items: list[NewsItem]) -> float:
    """Return a simple rule-based sentiment score between -1 and 1."""
    positive_terms = {"growth", "beat", "strong", "hawkish", "rally"}
    negative_terms = {"miss", "weak", "dovish", "recession", "selloff"}
    score = 0
    for item in items:
        words = set(item.title.lower().split())
        score += len(words & positive_terms)
        score -= len(words & negative_terms)
    if not items:
        return 0.0
    return max(-1.0, min(1.0, score / len(items)))
