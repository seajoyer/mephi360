import psycopg2
from psycopg2 import sql
import os
import logging
import bcrypt

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection parameters
DB_NAME = "mephi360"
DB_USER = "dmitry"
DB_PASSWORD = "123passw0rd5"
# DB_HOST = os.environ.get('DB_HOST')
# DB_PORT = os.environ.get('DB_PORT')

def get_db_connection():
    try:
        connection = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            # host=DB_HOST,
            # port=DB_PORT
        )
        return connection
    except (Exception, psycopg2.Error) as error:
        logger.error(f"Error while connecting to PostgreSQL: {error}")
        return None

def user_exists(telegram_id):
    connection = get_db_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT EXISTS(SELECT 1 FROM users WHERE telegram_id = %s)", (telegram_id,))
                return cursor.fetchone()[0]
        except (Exception, psycopg2.Error) as error:
            logger.error(f"Error while checking user existence: {error}")
        finally:
            connection.close()
    return False

def add_user(telegram_id, first_name):
    connection = get_db_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                query = sql.SQL("""
                    INSERT INTO users (telegram_id, name)
                    VALUES (%s, %s)
                    ON CONFLICT (telegram_id)
                    DO UPDATE SET name = EXCLUDED.name
                """)
                cursor.execute(query, (telegram_id, first_name))
                connection.commit()
                logger.info(f"User added or updated for telegram_id: {telegram_id}")
        except (Exception, psycopg2.Error) as error:
            logger.error(f"Error while adding user: {error}")
        finally:
            connection.close()

def update_user_data(telegram_id, profile_data, password):
    connection = get_db_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                query = sql.SQL("""
                    UPDATE users
                    SET name = %s, login = %s, study_group = %s, password_hash = %s
                    WHERE telegram_id = %s
                """)
                cursor.execute(query, (
                    profile_data.get('full_name'),
                    profile_data.get('login'),
                    profile_data.get('group'),
                    hashed_password.decode('utf-8'),
                    telegram_id
                ))
                connection.commit()
                logger.info(f"User data updated for telegram_id: {telegram_id}")
        except (Exception, psycopg2.Error) as error:
            logger.error(f"Error while updating user data: {error}")
        finally:
            connection.close()

def user_has_credentials(telegram_id):
    connection = get_db_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT EXISTS(
                        SELECT 1 FROM users
                        WHERE telegram_id = %s
                        AND login IS NOT NULL
                        AND password_hash IS NOT NULL
                    )
                """, (telegram_id,))
                return cursor.fetchone()[0]
        except (Exception, psycopg2.Error) as error:
            logger.error(f"Error while checking user credentials: {error}")
        finally:
            connection.close()
    return False
