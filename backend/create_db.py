from app.database.session import engine, Base
from app.models.voice import Voice

Base.metadata.create_all(bind=engine)
print("Database initialized.")
