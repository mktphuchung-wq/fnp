"""Trade journal analytics."""

from fx_trading_agent.journal.models import TradeJournalEntry


def win_rate(entries: list[TradeJournalEntry]) -> float:
    """Calculate win rate for closed trades with PnL."""
    closed = [entry for entry in entries if entry.pnl is not None]
    if not closed:
        return 0.0
    wins = [entry for entry in closed if entry.pnl and entry.pnl > 0]
    return len(wins) / len(closed)


def equity_curve(entries: list[TradeJournalEntry], starting_equity: float = 0.0) -> list[float]:
    """Build an equity curve from sequential trade PnL values."""
    equity = starting_equity
    curve = [equity]
    for entry in entries:
        if entry.pnl is not None:
            equity += entry.pnl
            curve.append(equity)
    return curve
