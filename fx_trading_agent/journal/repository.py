"""Repository helpers for the trade journal."""

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from fx_trading_agent.journal.models import Base, TradeJournalEntry


class JournalRepository:
    """Store and query journal entries."""

    def __init__(self, database_url: str) -> None:
        self.engine = create_engine(database_url)
        self.session_factory = sessionmaker(bind=self.engine)

    def create_schema(self) -> None:
        """Create journal database tables."""
        Base.metadata.create_all(self.engine)

    def add(self, entry: TradeJournalEntry) -> TradeJournalEntry:
        """Persist a journal entry."""
        with Session(self.engine) as session:
            session.add(entry)
            session.commit()
            session.refresh(entry)
            return entry

    def list_recent(self, limit: int = 100) -> list[TradeJournalEntry]:
        """Return the most recent journal entries."""
        with self.session_factory() as session:
            statement = select(TradeJournalEntry).order_by(TradeJournalEntry.opened_at.desc()).limit(limit)
            return list(session.scalars(statement))
