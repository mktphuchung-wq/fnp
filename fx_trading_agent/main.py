"""Main orchestrator for scheduled trading workflows."""

from fx_trading_agent.config.settings import get_settings
from fx_trading_agent.utils.logger import get_logger

logger = get_logger(__name__)


def main() -> None:
    """Start the trading agent scheduler scaffold."""
    settings = get_settings()
    logger.info("Starting FX trading agent in %s mode for pairs: %s", settings.environment, settings.trading_pairs)


if __name__ == "__main__":
    main()
