"""Application settings for the FX trading agent."""

from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables and YAML."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="FX_AGENT_", extra="ignore")

    environment: str = "paper"
    oanda_api_key: str | None = None
    oanda_account_id: str | None = None
    oanda_environment: str = "practice"
    base_currency: str = "USD"
    trading_pairs: list[str] = Field(default_factory=lambda: ["EUR_USD", "GBP_USD", "USD_JPY"])
    risk_per_trade: float = 0.01
    max_daily_loss: float = 0.03
    max_open_positions: int = 3
    journal_database_url: str = "sqlite:///journal.db"

    @classmethod
    def from_yaml(cls, path: str | Path = "fx_trading_agent/config/config.yaml") -> "Settings":
        """Build settings from a YAML file, allowing environment overrides."""
        config_path = Path(path)
        data: dict[str, Any] = {}
        if config_path.exists():
            data = yaml.safe_load(config_path.read_text()) or {}
        return cls(**data)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings.from_yaml()
