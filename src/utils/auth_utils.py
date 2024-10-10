from cryptography.fernet import Fernet
from src.config import ENCRYPTION_KEY
import base64
import os
import logging

logger = logging.getLogger(__name__)

def generate_key():
    return base64.urlsafe_b64encode(os.urandom(32))

fernet = Fernet(ENCRYPTION_KEY)

def encrypt_password(password: str) -> str:
    try:
        encrypted = fernet.encrypt(password.encode()).decode()
        logger.info("Password encrypted successfully")
        return encrypted
    except Exception as e:
        logger.error(f"Error encrypting password: {str(e)}")
        raise

def decrypt_password(encrypted_password: str) -> str:
    try:
        decrypted = fernet.decrypt(encrypted_password.encode()).decode()
        logger.info("Password decrypted successfully")
        return decrypted
    except Exception as e:
        logger.error(f"Error decrypting password: {str(e)}")
        raise
