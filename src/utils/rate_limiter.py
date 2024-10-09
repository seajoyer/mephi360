from collections import defaultdict
from time import time

class RateLimiter:
    def __init__(self, max_calls, period):
        self.max_calls = max_calls
        self.period = period
        self.calls = defaultdict(list)

    async def is_allowed(self, key):
        current_time = time()
        self.calls[key] = [t for t in self.calls[key] if current_time - t < self.period]
        if len(self.calls[key]) < self.max_calls:
            self.calls[key].append(current_time)
            return True
        return False
