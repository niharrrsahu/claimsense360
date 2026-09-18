import pytest
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, decode_access_token

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
