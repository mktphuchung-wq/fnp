"""Thin OANDA API wrapper used by data and execution modules."""

from dataclasses import dataclass
from typing import Any

import requests


@dataclass(slots=True)
class OandaClient:
    """Small HTTP client for OANDA REST endpoints."""

    api_key: str
    account_id: str
    environment: str = "practice"
    timeout_seconds: int = 30

    @property
    def base_url(self) -> str:
        """Return the REST base URL for the selected OANDA environment."""
        if self.environment == "live":
            return "https://api-fxtrade.oanda.com/v3"
        return "https://api-fxpractice.oanda.com/v3"

    @property
    def headers(self) -> dict[str, str]:
        """Return authenticated request headers."""
        return {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}

    def request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
        """Send a request to OANDA and return decoded JSON."""
        response = requests.request(
            method=method,
            url=f"{self.base_url}/{path.lstrip('/')}",
            headers=self.headers,
            timeout=self.timeout_seconds,
            **kwargs,
        )
        response.raise_for_status()
        return response.json()

    def get_account_summary(self) -> dict[str, Any]:
        """Fetch account summary information."""
        return self.request("GET", f"accounts/{self.account_id}/summary")
