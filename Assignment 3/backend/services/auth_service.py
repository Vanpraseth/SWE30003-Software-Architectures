# Author: Anh Phan
import hashlib
import hmac
import os
import re
import secrets

from repositories.user_repo import UserRepository

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

_SESSIONS = {}


def _hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"pbkdf2${salt}${digest.hex()}"


def _verify_password(password, stored):
    if stored.startswith("pbkdf2$"):
        _, salt, _ = stored.split("$", 2)
        return hmac.compare_digest(_hash_password(password, salt), stored)
    return hmac.compare_digest(password, stored)


class ValidationError(Exception):
    pass


class AuthService:
    def __init__(self):
        self.users = UserRepository()

    def register(self, full_name, email, password):
        if not full_name or not full_name.strip():
            raise ValidationError("Name required.")
        if not email or not _EMAIL_RE.match(email):
            raise ValidationError("Invalid email.")
        if not password or len(password) < 11:
            raise ValidationError("Password min 11 chars.")
        if self.users.find_by_email(email):
            raise ValidationError("Email already in use.")

        user_id = self.users.create(full_name.strip(), email, _hash_password(password))
        if user_id is None:
            raise ValidationError("Registration failed.")
        return {"user_id": user_id, "full_name": full_name.strip(),
                "email": email, "role": "customer"}

    def login(self, email, password):
        if not email or not password:
            raise ValidationError("Email and password required.")
        row = self.users.find_by_email(email)
        if not row or not _verify_password(password, row["password"]):
            return None

        if not row["password"].startswith("pbkdf2$"):
            self.users.update_password(row["user_id"], _hash_password(password))

        user = {"user_id": row["user_id"], "full_name": row["full_name"],
                "email": row["email"], "role": row["role"]}
        token = secrets.token_urlsafe(24)
        _SESSIONS[token] = user
        return {"token": token, "user": user}

    @staticmethod
    def user_for_token(token):
        return _SESSIONS.get(token)
