"""PDF Export service using ReportLab."""
import os
from pathlib import Path
from typing import Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from src.models.evidence import ResearchReport


def generate_pdf_report(
    report: ResearchReport, output_path: Optional[str] = None
) -> str:
    """Generates a professional PDF research report using ReportLab.

    Returns the absolute path of the generated PDF.
    """
    if not output_path:
        reports_dir = Path("generated_reports")
        reports_dir.mkdir(parents=True, exist_ok=True)
        filename = f"ProofTrail_Report_{report.session_id[:8]}.pdf"
        output_path = str(reports_dir / filename)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#1A2B4C")     # Deep Navy
    SECONDARY = colors.HexColor("#2E5B88")   # Slate Blue
    ACCENT = colors.HexColor("#D97706")      # Amber
    DARK_TEXT = colors.HexColor("#1F2937")   # Charcoal
    LIGHT_BG = colors.HexColor("#F3F4F6")    # Light Gray

    # Status Colors
    COLOR_SUPPORTED = colors.HexColor("#059669")
    COLOR_PARTIAL = colors.HexColor("#D97706")
    COLOR_CONFLICT = colors.HexColor("#DC2626")
    COLOR_UNVERIFIED = colors.HexColor("#6B7280")

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        alignment=0,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
    )

    h2_style = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=DARK_TEXT,
        spaceAfter=6,
    )

    code_style = ParagraphStyle(
        "Code_Custom",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8.5,
        leading=11,
        textColor=DARK_TEXT,
    )

    story = []

    # Header / Branding
    story.append(Paragraph("PROOFTRAIL AI", subtitle_style))
    story.append(Paragraph("The Evidence Intelligence Engine", ParagraphStyle("BrandTag", parent=subtitle_style, fontSize=9, textColor=ACCENT)))
    story.append(Spacer(1, 4))
    story.append(Paragraph(report.question, title_style))
    story.append(Spacer(1, 6))

    meta_text = f"<b>Session ID:</b> {report.session_id} | <b>Date:</b> {report.created_at[:10]}"
    story.append(Paragraph(meta_text, body_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=6, spaceAfter=12))

    # Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(report.executive_summary.replace("\n", "<br/>"), body_style))
    story.append(Spacer(1, 8))

    # Scope & Methodology
    story.append(Paragraph("2. Scope & Methodology", h1_style))
    story.append(Paragraph(f"<b>Research Scope:</b> {report.research_scope}", body_style))
    story.append(Paragraph(f"<b>Methodology:</b> {report.methodology}", body_style))
    story.append(Spacer(1, 8))

    # Key Findings
    story.append(Paragraph("3. Key Findings", h1_style))
    for finding in report.key_findings:
        bullet_text = f"• {finding}"
        story.append(Paragraph(bullet_text, body_style))
    story.append(Spacer(1, 8))

    # Claim Verification Table
    if report.claim_verifications:
        story.append(Paragraph("4. Claim Verification Summary", h1_style))
        table_data = [["Claim", "Category", "Status", "Explanation"]]
        for claim in report.claim_verifications:
            status_str = claim.verification_status.value
            status_color = COLOR_UNVERIFIED
            if status_str == "SUPPORTED":
                status_color = COLOR_SUPPORTED
            elif status_str == "PARTIALLY_SUPPORTED":
                status_color = COLOR_PARTIAL
            elif status_str == "CONFLICTING":
                status_color = COLOR_CONFLICT

            status_p = Paragraph(f"<font color='{status_color.hexval()}'><b>{status_str}</b></font>", body_style)
            claim_p = Paragraph(claim.claim_text, body_style)
            cat_p = Paragraph(claim.claim_category.value, body_style)
            exp_p = Paragraph(claim.explanation or "", body_style)
            table_data.append([claim_p, cat_p, status_p, exp_p])

        t = Table(table_data, colWidths=[160, 75, 85, 220])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), PRIMARY),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(t)
        story.append(Spacer(1, 10))

    # Supporting Evidence Passages
    if report.supporting_evidence:
        story.append(Paragraph("5. Sourced Evidence Passages", h1_style))
        for ev in report.supporting_evidence:
            rel_color = COLOR_SUPPORTED if ev.relationship.value == "SUPPORTS" else COLOR_CONFLICT
            rel_html = f"<font color='{rel_color.hexval()}'><b>[{ev.relationship.value}]</b></font>"
            passage_box = f"<i>\"{ev.exact_passage}\"</i><br/>{rel_html} Source ID: <b>{ev.source_id}</b> — {ev.relevance_explanation}"
            story.append(Paragraph(passage_box, body_style))
            story.append(Spacer(1, 4))
        story.append(Spacer(1, 8))

    # Conflicting Information
    if report.conflicting_information:
        story.append(Paragraph("6. Conflicting Evidence Analysis", h1_style))
        for conflict in report.conflicting_information:
            c_text = f"<b>Conflict ({conflict.conflict_type}):</b> {conflict.explanation}<br/>" \
                     f"• Source A ({conflict.source_a_id}): <i>\"{conflict.passage_a}\"</i><br/>" \
                     f"• Source B ({conflict.source_b_id}): <i>\"{conflict.passage_b}\"</i>"
            story.append(Paragraph(c_text, body_style))
            story.append(Spacer(1, 4))
        story.append(Spacer(1, 8))

    # Research Gaps & Limitations
    story.append(Paragraph("7. Research Gaps & Limitations", h1_style))
    if report.research_gaps:
        story.append(Paragraph("<b>Identified Gaps:</b>", h2_style))
        for gap in report.research_gaps:
            story.append(Paragraph(f"• {gap}", body_style))
    if report.limitations:
        story.append(Paragraph("<b>Methodological Limitations:</b>", h2_style))
        for lim in report.limitations:
            story.append(Paragraph(f"• {lim}", body_style))
    story.append(Spacer(1, 8))

    # Conclusion
    story.append(Paragraph("8. Conclusion", h1_style))
    story.append(Paragraph(report.conclusion.replace("\n", "<br/>"), body_style))
    story.append(Spacer(1, 10))

    # References Table
    if report.references:
        story.append(Paragraph("9. Verified References", h1_style))
        ref_data = [["ID", "Title & Publisher", "Quality", "URL"]]
        for src in report.references:
            id_p = Paragraph(f"<b>{src.source_id}</b>", body_style)
            title_p = Paragraph(f"<b>{src.title}</b><br/>{src.domain}", body_style)
            qual_p = Paragraph(src.quality_assessment.value, body_style)
            url_p = Paragraph(f"<font color='blue'><u>{src.url}</u></font>", body_style)
            ref_data.append([id_p, title_p, qual_p, url_p])

        ref_table = Table(ref_data, colWidths=[45, 205, 55, 235])
        ref_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), PRIMARY),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(ref_table)

    # Citation Validation Footer
    story.append(Spacer(1, 12))
    cv = report.citation_validation
    cv_status = "PASSED" if cv.is_valid else "FLAGS DETECTED"
    cv_text = f"<b>Citation Validation Integrity Check:</b> {cv_status} | Validated Citations: {cv.valid_citations}/{cv.total_citations}"
    story.append(Paragraph(cv_text, ParagraphStyle("CVFoot", parent=body_style, fontSize=8, textColor=SECONDARY)))

    doc.build(story)
    return os.path.abspath(output_path)
