from app.rag_ingestion.domain.entities import ProcessUploadedDocumentCommand, RagParseResult
from app.rag_ingestion.domain.ports import RagParserPort


class PassthroughRagParser(RagParserPort):
    def parse(self, command: ProcessUploadedDocumentCommand) -> RagParseResult:
        text = command.raw_text if command.raw_text.strip() else command.title
        return RagParseResult(text=text)
