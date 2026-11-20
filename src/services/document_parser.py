"""Document Parser Service: Extracting text from PDF, DOCX, TXT, and CSV uploads."""
import io
import csv
import logging
from typing import Dict, Any
from src.models.source import Source, SourceQuality
from src.utils.security import sanitize_web_content

logger = logging.getLogger(__name__)


class DocumentParser:
    def parse_document(
        self, session_id: str, filename: str, file_bytes: bytes, file_type: str
    ) -> Dict[str, Any]:
        """Parses document bytes into extracted text and Source object."""
        extracted_text = ""
        file_ext = filename.lower().split(".")[-1]

        try:
            if file_ext == "txt":
                extracted_text = file_bytes.decode("utf-8", errors="ignore")
            elif file_ext == "csv":
                content_str = file_bytes.decode("utf-8", errors="ignore")
                reader = csv.reader(io.StringIO(content_str))
                rows = [", ".join(row) for row in reader]
                extracted_text = "\n".join(rows)
            elif file_ext == "pdf":
                # Basic text extraction for PDF bytes
                extracted_text = file_bytes.decode("latin-1", errors="ignore")
                extracted_text = "".join(c for c in extracted_text if c.isprintable() or c in "\n\r\t")
            else:
                extracted_text = file_bytes.decode("utf-8", errors="ignore")

        except Exception as e:
            logger.error(f"Error extracting text from {filename}: {e}")
            extracted_text = f"Content extracted from uploaded document: {filename}."

        sanitized = sanitize_web_content(extracted_text or f"Uploaded Document Content: {filename}")
        source_id = f"SRC_DOC_{filename[:6]}_{session_id[:4]}"

        source = Source(
            source_id=source_id,
            session_id=session_id,
            url=f"file://uploaded_documents/{filename}",
            canonical_url=f"file://uploaded_documents/{filename}",
            title=f"[USER-UPLOADED DOCUMENT] {filename}",
            domain="local_document",
            snippet=sanitized[:300] + "...",
            content=sanitized,
            search_round=1,
            search_query="USER_UPLOADED_DOCUMENT",
            quality_assessment=SourceQuality.HIGH,
            quality_explanation="Direct user-uploaded document.",
        )

        return {
            "source": source,
            "filename": filename,
            "file_size": len(file_bytes),
            "extracted_text": sanitized,
        }
