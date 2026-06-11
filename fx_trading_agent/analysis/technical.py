"""Technical indicators and pattern detection."""


def simple_moving_average(values: list[float], period: int) -> float | None:
    """Calculate the simple moving average for the last ``period`` values."""
    if period <= 0 or len(values) < period:
        return None
    return sum(values[-period:]) / period


def momentum(values: list[float], lookback: int = 14) -> float | None:
    """Calculate simple price momentum over a lookback window."""
    if lookback <= 0 or len(values) <= lookback:
        return None
    return values[-1] - values[-lookback - 1]
