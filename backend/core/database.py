from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

# MongoDB connection
client = None
db = None

async def connect_to_mongodb():
    """Create database connection"""
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
    db = client[settings.DATABASE_NAME]
    print("Connected to MongoDB!")

async def close_mongodb_connection():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_database():
    """Get database instance"""
    global db
    if db is None:
        # This is a fallback in case get_database is called before connect_to_mongodb
        client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
        db = client[settings.DATABASE_NAME]
        print("Connected to MongoDB (fallback)!")
    return db