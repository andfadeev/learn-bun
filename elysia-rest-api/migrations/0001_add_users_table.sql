CREATE TABLE IF NOT EXISTS users
(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    about TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
)