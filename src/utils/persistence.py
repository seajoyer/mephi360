from telegram.ext import BasePersistence
from telegram.ext._utils.types import ConversationDict, CDCData
from src.utils.database import get_db
from sqlalchemy import Column, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from src.utils.database import Base
from typing import Dict, Optional, Any

class PersistenceData(Base):
    __tablename__ = 'persistence_data'

    key = Column(String, primary_key=True)
    data = Column(JSON)

class SQLAlchemyPersistence(BasePersistence):
    def __init__(self):
        super().__init__()
        self.db = None

    async def get_db(self):
        async with get_db() as session:
            return session

    async def get_bot_data(self) -> Dict[Any, Any]:
        async with get_db() as session:
            result = await session.get(PersistenceData, 'bot_data')
            if result and result.data:
                return result.data
            return {}

    async def update_bot_data(self, data: Dict[Any, Any]) -> None:
        async with get_db() as session:
            persistence_data = PersistenceData(
                key='bot_data',
                data=data
            )
            session.merge(persistence_data)
            await session.commit()

    async def get_chat_data(self) -> Dict[int, Dict[Any, Any]]:
        async with get_db() as session:
            result = await session.get(PersistenceData, 'chat_data')
            if result and result.data:
                return result.data
            return {}

    async def update_chat_data(self, chat_id: int, data: Dict[Any, Any]) -> None:
        async with get_db() as session:
            chat_data = await self.get_chat_data()
            chat_data[str(chat_id)] = data
            persistence_data = PersistenceData(
                key='chat_data',
                data=chat_data
            )
            session.merge(persistence_data)
            await session.commit()

    async def get_user_data(self) -> Dict[int, Dict[Any, Any]]:
        async with get_db() as session:
            result = await session.get(PersistenceData, 'user_data')
            if result and result.data:
                return result.data
            return {}

    async def update_user_data(self, user_id: int, data: Dict[Any, Any]) -> None:
        async with get_db() as session:
            user_data = await self.get_user_data()
            user_data[str(user_id)] = data
            persistence_data = PersistenceData(
                key='user_data',
                data=user_data
            )
            await session.merge(persistence_data)
            await session.commit()

    async def get_callback_data(self) -> Optional[CDCData]:
        async with get_db() as session:
            result = await session.get(PersistenceData, 'callback_data')
            if result and result.data:
                return result.data
            return None

    async def update_callback_data(self, data: CDCData) -> None:
        async with get_db() as session:
            persistence_data = PersistenceData(
                key='callback_data',
                data=data
            )
            session.merge(persistence_data)
            await session.commit()

    async def get_conversations(self, name: str) -> ConversationDict:
        async with get_db() as session:
            result = await session.get(PersistenceData, f'conversations_{name}')
            if result and result.data:
                return result.data
            return {}

    async def update_conversation(self, name: str, data: ConversationDict) -> None:
        async with get_db() as session:
            persistence_data = PersistenceData(
                key=f'conversations_{name}',
                data=data
            )
            session.merge(persistence_data)
            await session.commit()

    async def flush(self) -> None:
        """Flush all data to database"""
        pass  # Data is already saved after each update

    async def refresh_user_data(self, user_id: int, user_data: Dict) -> None:
        """Override user data for given user"""
        await self.update_user_data(user_id, user_data)

    async def refresh_chat_data(self, chat_id: int, chat_data: Dict) -> None:
        """Override chat data for given chat"""
        await self.update_chat_data(chat_id, chat_data)

    async def refresh_bot_data(self, bot_data: Dict) -> None:
        """Override bot data"""
        await self.update_bot_data(bot_data)

    async def drop_chat_data(self, chat_id: int) -> None:
        async with get_db() as session:
            chat_data = await self.get_chat_data()
            if str(chat_id) in chat_data:
                del chat_data[str(chat_id)]
                persistence_data = PersistenceData(
                    key='chat_data',
                    data=chat_data
                )
                session.merge(persistence_data)
                await session.commit()

    async def drop_user_data(self, user_id: int) -> None:
        async with get_db() as session:
            user_data = await self.get_user_data()
            if str(user_id) in user_data:
                del user_data[str(user_id)]
                persistence_data = PersistenceData(
                    key='user_data',
                    data=user_data
                )
                session.merge(persistence_data)
                await session.commit()

    async def drop_data(self) -> None:
        async with get_db() as session:
            await session.query(PersistenceData).delete()
            await session.commit()
