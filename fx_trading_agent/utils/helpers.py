"""General helper utilities."""


def normalize_pair(pair: str) -> str:
    """Normalize a currency pair to OANDA instrument format."""
    cleaned = pair.replace("/", "_").replace("-", "_").upper()
    if "_" not in cleaned and len(cleaned) == 6:
        return f"{cleaned[:3]}_{cleaned[3:]}"
    return cleaned
