import sys
import os

# Ensure the ai-engine root directory is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
AI_ENGINE_ROOT = os.path.dirname(CURRENT_DIR)
if AI_ENGINE_ROOT not in sys.path:
    sys.path.insert(0, AI_ENGINE_ROOT)

from main import app
