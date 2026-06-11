"""Order placement and position management."""

from typing import Any

from fx_trading_agent.data.oanda_client import OandaClient


class OrderManager:
    """Place and manage broker orders."""

    def __init__(self, client: OandaClient) -> None:
        self.client = client

    def market_order(self, instrument: str, units: int, stop_loss: float | None = None, take_profit: float | None = None) -> dict[str, Any]:
        """Place a market order with optional stop-loss and take-profit prices."""
        order: dict[str, Any] = {
            "order": {
                "type": "MARKET",
                "instrument": instrument,
                "units": str(units),
                "timeInForce": "FOK",
                "positionFill": "DEFAULT",
            }
        }
        if stop_loss is not None:
            order["order"]["stopLossOnFill"] = {"price": str(stop_loss)}
        if take_profit is not None:
            order["order"]["takeProfitOnFill"] = {"price": str(take_profit)}
        return self.client.request("POST", f"accounts/{self.client.account_id}/orders", json=order)
