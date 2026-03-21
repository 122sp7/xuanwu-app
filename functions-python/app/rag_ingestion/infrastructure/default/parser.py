from app.rag_ingestion.domain.entities import ProcessUploadedDocumentCommand
from app.rag_ingestion.domain.ports import RagParserPort


class PassthroughRagParser(RagParserPort):
    def parse(self, command: ProcessUploadedDocumentCommand) -> str:
        if not command.raw_text.strip():
            return command.title
        return command.raw_text
