import os
from dataclasses import dataclass


class MissingEnvironmentVariableError(ValueError):
    pass


@dataclass(frozen=True)
class DocumentAiSettings:
    project_id: str
    location: str
    processor_id: str

    @property
    def processor_resource(self) -> str:
        return (
            f"projects/{self.project_id}/locations/{self.location}"
            f"/processors/{self.processor_id}"
        )


@dataclass(frozen=True)
class AppSettings:
    document_ai: DocumentAiSettings


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise MissingEnvironmentVariableError(f"Missing required environment variable: {name}")
    return value


def load_settings() -> AppSettings:
    project_id = _required_env("DOCUMENTAI_PROJECT_ID")
    location = os.getenv("DOCUMENTAI_LOCATION", "asia-southeast1")
    processor_id = _required_env("DOCUMENTAI_PROCESSOR_ID")

    return AppSettings(
        document_ai=DocumentAiSettings(
            project_id=project_id,
            location=location,
            processor_id=processor_id,
        )
    )
