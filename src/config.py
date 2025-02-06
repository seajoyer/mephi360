import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
METRICS_PORT = int(os.getenv('METRICS_PORT', '9091'))

if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY must be set in the environment variables")
