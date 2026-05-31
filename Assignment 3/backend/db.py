# Author: Anh Phan
import os
import sqlite3

_DEFAULT_DB = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "database",
    "bookstore.db",
)
DB_PATH = os.environ.get("BOOKSTORE_DB", _DEFAULT_DB)


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def row_to_dict(row):
    return dict(row) if row is not None else None


def rows_to_list(rows):
    return [dict(r) for r in rows]
