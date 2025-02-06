import asyncio
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import AsyncAdaptedQueuePool
from src.config import DATABASE_URL
import logging

logger = logging.getLogger(__name__)

Base = declarative_base()

# Global engine variable
engine = None
AsyncSessionLocal = None

async def setup_connection_pool():
    global engine, AsyncSessionLocal

    engine = create_async_engine(
        DATABASE_URL,
        echo=True,
        poolclass=AsyncAdaptedQueuePool,
        pool_size=20,
        max_overflow=10,
        pool_timeout=30,
        pool_pre_ping=True
    )

    AsyncSessionLocal = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

@asynccontextmanager
async def get_db():
    if AsyncSessionLocal is None:
        await setup_connection_pool()

    session = AsyncSessionLocal()
    try:
        yield session
        await session.commit()
    except Exception as e:
        await session.rollback()
        logger.error(f"Database error: {str(e)}")
        raise
    finally:
        await session.close()

async def init_db():
    global engine
    if engine is None:
        await setup_connection_pool()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
