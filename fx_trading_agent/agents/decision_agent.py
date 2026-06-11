"""Primary decision agent for trade scoring."""

from dataclasses import dataclass


@dataclass(slots=True)
class TradeSignal:
    """Decision output consumed by execution services."""

    instrument: str
    direction: str
    confidence: float
    reason: str


class DecisionAgent:
    """Combine analysis inputs into a trade decision."""

    def decide(self, instrument: str, scores: dict[str, float]) -> TradeSignal | None:
        """Return a trade signal when aggregate conviction is high enough."""
        if not scores:
            return None
        aggregate = sum(scores.values()) / len(scores)
        if abs(aggregate) < 0.3:
            return None
        direction = "buy" if aggregate > 0 else "sell"
        return TradeSignal(instrument=instrument, direction=direction, confidence=abs(aggregate), reason=str(scores))
