"""Fundamental and economic-calendar scoring."""


def score_economic_event(actual: float | None, forecast: float | None, higher_is_bullish: bool = True) -> float:
    """Score an economic release based on actual-vs-forecast surprise."""
    if actual is None or forecast in (None, 0):
        return 0.0
    surprise = (actual - forecast) / abs(forecast)
    return surprise if higher_is_bullish else -surprise
