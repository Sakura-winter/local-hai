import sys
import os

# Allow running uvicorn main:app from the repo root as well
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.main import app
