"""Multi-timeframe signal aggregation."""


def aggregate_timeframe_scores(scores: dict[str, float], weights: dict[str, float] | None = None) -> float:
    """Combine timeframe scores using optional weights."""
    if not scores:
        return 0.0
    weights = weights or {timeframe: 1.0 for timeframe in scores}
    total_weight = sum(weights.get(timeframe, 0.0) for timeframe in scores)
    if total_weight == 0:
        return 0.0
    return sum(score * weights.get(timeframe, 0.0) for timeframe, score in scores.items()) / total_weight
