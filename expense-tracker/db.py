import sqlite3
from pathlib import Path
from typing import Optional, Tuple, List


DB_PATH = Path(__file__).with_name("expenses.db")


def get_connection() -> sqlite3.Connection:
    """Return a SQLite connection to the app database."""
    return sqlite3.connect(DB_PATH)


def init_db() -> None:
    """Create the expenses table if it doesn't exist."""
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                category TEXT NOT NULL,
                amount REAL NOT NULL,
                note TEXT
            )
            """
        )
        conn.commit()


def insert_expense(date: str, category: str, amount: float, note: Optional[str]) -> int:
    """Insert a new expense row and return its id."""
    with get_connection() as conn:
        cursor = conn.execute(
            "INSERT INTO expenses (date, category, amount, note) VALUES (?, ?, ?, ?)",
            (date, category, amount, note),
        )
        conn.commit()
        return int(cursor.lastrowid)


def fetch_recent(limit: int = 10) -> Tuple[Tuple]:
    """Fetch recent expenses for simple verification/preview."""
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT id, date, category, amount, note FROM expenses ORDER BY id DESC LIMIT ?",
            (limit,),
        )
        return tuple(cursor.fetchall())


def fetch_all() -> Tuple[Tuple]:
    """Fetch all expenses ordered by id descending."""
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT id, date, category, amount, note FROM expenses ORDER BY id DESC"
        )
        return tuple(cursor.fetchall())


def fetch_category_totals() -> List[Tuple[str, float]]:
    """Fetch total amount by category for pie chart."""
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT category, SUM(amount) FROM expenses GROUP BY category ORDER BY SUM(amount) DESC"
        )
        return list(cursor.fetchall())


def fetch_date_totals() -> List[Tuple[str, float]]:
    """Fetch total amount by date for line chart."""
    with get_connection() as conn:
        cursor = conn.execute(
            "SELECT date, SUM(amount) FROM expenses GROUP BY date ORDER BY date"
        )
        return list(cursor.fetchall())

