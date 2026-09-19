import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, decode_access_token, get_current_user
from app.models.user import User

def test_password_hashing():
    """Test bcrypt password hashing and verification."""
    password = "SuperSecretPassword123!"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_encoding_decoding():
    """Test JWT token generation and payload decoding."""
    user_id = 42
    token = create_access_token(data={"sub": str(user_id)})
    
    assert isinstance(token, str)
    assert len(token) > 20
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded.get("sub") == str(user_id)


def test_jwt_invalid_token_decoding():
    """Test decoding of malformed or invalid JWT tokens."""
    invalid_token = "invalid.jwt.token.string"
    decoded = decode_access_token(invalid_token)
    assert decoded is None


def test_get_current_user_no_credentials():
    """Test get_current_user with missing credentials raises HTTP 401."""
    db_mock = MagicMock()
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(credentials=None, db=db_mock)
    assert exc_info.value.status_code == 401
    assert "Not authenticated" in exc_info.value.detail


def test_get_current_user_invalid_token():
    """Test get_current_user with invalid token credentials raises HTTP 401."""
    db_mock = MagicMock()
    credentials_mock = MagicMock()
    credentials_mock.credentials = "invalid.token"
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(credentials=credentials_mock, db=db_mock)
    assert exc_info.value.status_code == 401
    assert "Invalid or expired token" in exc_info.value.detail


def test_get_current_user_valid_user_found(db_session):
    """Test get_current_user with valid JWT token returning actual database user."""
    test_user = User(full_name="Mutmut Tester", email="mutmut_test@claimsense360.com", password="hashed_pass_123", role="adjuster")
    db_session.add(test_user)
    db_session.commit()
    db_session.refresh(test_user)
    
    token = create_access_token(data={"sub": test_user.email})
    credentials_mock = MagicMock()
    credentials_mock.credentials = token
    
    current_user = get_current_user(credentials=credentials_mock, db=db_session)
    assert current_user is not None
    assert current_user.email == test_user.email
