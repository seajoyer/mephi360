# src/utils/metrics.py
from prometheus_client import Counter, Histogram, Gauge
import time
from functools import wraps
from telegram.ext import Application
from typing import Callable, Any

# Command metrics
COMMAND_COUNTER = Counter(
    'telegram_bot_commands_total',
    'Total number of commands received',
    ['command']
)

# Message metrics
MESSAGE_COUNTER = Counter(
    'telegram_bot_messages_total',
    'Total number of messages processed',
    ['type']  # 'text', 'photo', 'document', etc.
)

# Error metrics
ERROR_COUNTER = Counter(
    'telegram_bot_errors_total',
    'Total number of errors encountered',
    ['type', 'handler']
)

# Response time metrics
RESPONSE_TIME = Histogram(
    'telegram_bot_response_seconds',
    'Response time in seconds',
    ['handler'],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# Active users metric
ACTIVE_USERS = Gauge(
    'telegram_bot_active_users',
    'Number of users currently interacting with the bot'
)

def track_metrics(func: Callable) -> Callable:
    @wraps(func)
    async def wrapper(update: Any, context: Any, *args: Any, **kwargs: Any) -> Any:
        start_time = time.time()

        # Determine handler name
        handler_name = func.__name__

        try:
            # Track command usage
            if update.message and update.message.text and update.message.text.startswith('/'):
                COMMAND_COUNTER.labels(command=update.message.text.split()[0]).inc()

            # Track message types
            if update.message:
                message_type = (
                    'text' if update.message.text
                    else 'photo' if update.message.photo
                    else 'document' if update.message.document
                    else 'other'
                )
                MESSAGE_COUNTER.labels(type=message_type).inc()

            # Execute handler
            result = await func(update, context, *args, **kwargs)

            # Record response time
            RESPONSE_TIME.labels(handler=handler_name).observe(
                time.time() - start_time
            )

            return result

        except Exception as e:
            # Record errors
            ERROR_COUNTER.labels(
                type=type(e).__name__,
                handler=handler_name
            ).inc()
            raise

    return wrapper

def init_metrics(port: int) -> None:
    """Initialize metrics server on specified port"""
    from prometheus_client import start_http_server
    start_http_server(port)
