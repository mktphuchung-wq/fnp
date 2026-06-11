"""Risk checks for proposed trades."""

from dataclasses import dataclass


@dataclass(slots=True)
class RiskLimits:
    """Configurable account risk limits."""

    risk_per_trade: float
    max_daily_loss: float
    max_open_positions: int


class RiskManager:
    """Validate trade ideas against account-level constraints."""

    def __init__(self, limits: RiskLimits) -> None:
        self.limits = limits

    def can_open_trade(self, open_positions: int, daily_loss_fraction: float) -> bool:
        """Return whether a new position can be opened."""
        return open_positions < self.limits.max_open_positions and daily_loss_fraction < self.limits.max_daily_loss
