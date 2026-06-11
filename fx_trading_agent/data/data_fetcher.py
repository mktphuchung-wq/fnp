"""Market data retrieval helpers."""

from typing import Any

from fx_trading_agent.data.oanda_client import OandaClient


class DataFetcher:
    """Fetch candles and live prices from the broker client."""

    def __init__(self, client: OandaClient) -> None:
        self.client = client

    def candles(self, instrument: str, granularity: str = "H1", count: int = 200) -> list[dict[str, Any]]:
        """Return recent candlestick data for an instrument."""
        payload = self.client.request(
            "GET",
            f"instruments/{instrument}/candles",
            params={"granularity": granularity, "count": count, "price": "MBA"},
        )
        return payload.get("candles", [])

    def current_price(self, instrument: str) -> dict[str, Any]:
        """Return current bid/ask pricing for an instrument."""
        payload = self.client.request(
            "GET",
            f"accounts/{self.client.account_id}/pricing",
            params={"instruments": instrument},
        )
        prices = payload.get("prices", [])
        return prices[0] if prices else {}
