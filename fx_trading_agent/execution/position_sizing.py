"""Position sizing utilities."""


def fixed_fractional_units(account_balance: float, risk_fraction: float, stop_loss_pips: float, pip_value: float) -> int:
    """Calculate units using fixed-fractional risk sizing."""
    if account_balance <= 0 or risk_fraction <= 0 or stop_loss_pips <= 0 or pip_value <= 0:
        return 0
    risk_amount = account_balance * risk_fraction
    return int(risk_amount / (stop_loss_pips * pip_value))
