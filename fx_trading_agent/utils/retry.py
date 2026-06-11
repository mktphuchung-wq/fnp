"""Retry helpers for transient operations."""

from collections.abc import Callable
from time import sleep
from typing import TypeVar

T = TypeVar("T")


def retry(operation: Callable[[], T], attempts: int = 3, delay_seconds: float = 1.0) -> T:
    """Retry an operation and re-raise the final exception on failure."""
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            return operation()
        except Exception as error:  # noqa: BLE001 - caller decides which operations are retry-safe
            last_error = error
            if attempt < attempts - 1:
                sleep(delay_seconds)
    if last_error is not None:
        raise last_error
    raise RuntimeError("retry called with zero attempts")
