import os
from os.path import join, dirname
from dotenv import load_dotenv
import pusher

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

client_pusher = pusher.Pusher(
  app_id=os.environ.get("PUSHER_APP_ID"),
  key=os.environ.get("PUSHER_KEY"),
  secret=os.environ.get("PUSHER_SECRET"),
  cluster=os.environ.get("PUSHER_CLUSTER"),
  ssl=True
)