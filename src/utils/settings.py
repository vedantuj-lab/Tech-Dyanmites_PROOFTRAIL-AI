"""Central settings and configuration management."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()


class Settings:
    def __init__(self):
        self.nebius_api_key: str = os.getenv("NEBIUS_API_KEY", "")
        self.nebius_base_url: str = os.getenv(
            "NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1"
        )
        self.nebius_model: str = os.getenv(
            "NEBIUS_MODEL", "MiniMaxAI/MiniMax-M3"
        )
        self.tavily_api_key: str = os.getenv("TAVILY_API_KEY", "")
        self.app_env: str = os.getenv("APP_ENV", "development")
        self.database_path: str = os.getenv(
            "DATABASE_PATH", "data/prooftrail.db"
        )
        self.mock_mode: bool = (
            os.getenv("MOCK_MODE", "false").lower() in ("true", "1", "yes")
        )
        self.max_research_rounds: int = int(
            os.getenv("MAX_RESEARCH_ROUNDS", "3")
        )
        self.max_results_per_query: int = int(
            os.getenv("MAX_RESULTS_PER_QUERY", "5")
        )
        self.max_sources: int = int(os.getenv("MAX_SOURCES", "20"))

    def check_nebius_configured(self) -> bool:
        return bool(self.nebius_api_key.strip()) and not self.mock_mode

    def check_tavily_configured(self) -> bool:
        return bool(self.tavily_api_key.strip()) and not self.mock_mode

    def is_mock_mode(self) -> bool:
        if self.mock_mode:
            return True
        # If API keys are missing, fallback to mock mode for safety during local dev / testing
        if not self.nebius_api_key.strip() or not self.tavily_api_key.strip():
            return True
        return False


settings = Settings()
