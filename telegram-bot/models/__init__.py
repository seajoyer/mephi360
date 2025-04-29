# Import in specific order to handle relationships
from src.models.user import User
from src.models.ad import Ad, Subject
from src.models.telegram_accounts import TelegramAccount

# This ensures all models are loaded before any relationships are established
__all__ = ['User', 'Ad', 'Subject', 'TelegramAccount']
