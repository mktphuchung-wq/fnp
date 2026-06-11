"""News collection interface for macro and currency headlines."""

from dataclasses import dataclass


@dataclass(slots=True)
class NewsItem:
    """Normalized news item used by sentiment analysis."""

    title: str
    source: str
    url: str
    published_at: str | None = None


class NewsFetcher:
    """Placeholder news fetcher to be backed by a provider API."""

    def latest(self, currencies: list[str]) -> list[NewsItem]:
        """Fetch latest headlines for the requested currencies."""
        return []
