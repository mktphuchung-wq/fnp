# FX Trading Agent

Skeleton project for an automated FX trading agent with OANDA integration, multi-factor analysis, risk management, execution, journaling, and dashboard modules.

## Structure

- `config/`: Pydantic settings and editable YAML configuration.
- `data/`: OANDA client, candle/price retrieval, and news ingestion.
- `analysis/`: Technical, sentiment, fundamental, and multi-timeframe scoring.
- `agents/`: Decision logic and risk checks.
- `execution/`: Order placement and position sizing.
- `journal/`: SQLAlchemy models, repository, and performance analytics.
- `ui/`: Telegram alerts and Streamlit dashboard.
- `utils/`: Logging, helper, and retry utilities.
- `main.py`: Scheduler/orchestrator entry point.
- `backtest.py`: Standalone backtesting entry point.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r fx_trading_agent/requirements.txt
python -m fx_trading_agent.main
```

Configure API credentials via environment variables such as `FX_AGENT_OANDA_API_KEY` and `FX_AGENT_OANDA_ACCOUNT_ID`, or edit `config/config.yaml` for non-secret defaults.
