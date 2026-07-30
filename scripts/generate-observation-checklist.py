from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "wildkind-30-day-pet-behavior-observation-checklist.pdf"
PUBLIC = ROOT / "public" / "resources" / "wildkind-30-day-pet-behavior-observation-checklist.pdf"

PAGE_WIDTH, PAGE_HEIGHT = landscape(A4)

OBSIDIAN = colors.HexColor("#1A1816")
SAND = colors.HexColor("#E8D5B5")
PAPER = colors.HexColor("#F2E6CF")
MOSS = colors.HexColor("#6B8A5A")
SLATE = colors.HexColor("#5A7A8A")
EMBER = colors.HexColor("#C4703A")
MUTED = colors.HexColor("#6B6257")
LINE = colors.HexColor("#A99B84")
WHITE = colors.white


def paragraph_style(name, *, size=8, leading=10, color=OBSIDIAN, font="Helvetica", alignment=TA_LEFT):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=alignment,
        spaceAfter=0,
        spaceBefore=0,
    )


BODY = paragraph_style("body", size=9, leading=13, color=OBSIDIAN)
SMALL = paragraph_style("small", size=6.5, leading=8.2, color=MUTED)
CELL = paragraph_style("cell", size=6.3, leading=7.8, color=OBSIDIAN)
CELL_BOLD = paragraph_style("cell-bold", size=6.3, leading=7.8, color=OBSIDIAN, font="Helvetica-Bold")
HEADER = paragraph_style("header", size=7.2, leading=8.5, color=WHITE, font="Helvetica-Bold")


def draw_paw(c, x, y, scale=1.0, stroke=SAND):
    c.saveState()
    c.setStrokeColor(stroke)
    c.setLineWidth(1.1 * scale)
    c.ellipse(x + 6 * scale, y, x + 24 * scale, y + 14 * scale, stroke=1, fill=0)
    c.ellipse(x + 1 * scale, y + 15 * scale, x + 8 * scale, y + 25 * scale, stroke=1, fill=0)
    c.ellipse(x + 10 * scale, y + 20 * scale, x + 17 * scale, y + 31 * scale, stroke=1, fill=0)
    c.ellipse(x + 21 * scale, y + 15 * scale, x + 28 * scale, y + 25 * scale, stroke=1, fill=0)
    c.restoreState()


def draw_brand(c, x, y, color=SAND):
    draw_paw(c, x, y - 2, 0.68, color)
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x + 26, y + 4, "WILDKIND")


def draw_footer(c, page_number, total_pages=5):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.4)
    c.line(12 * mm, 10 * mm, PAGE_WIDTH - 12 * mm, 10 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.5)
    c.drawString(12 * mm, 6.2 * mm, "Free record-keeping resource - pet-wildkind.co.uk")
    footer = f"30-DAY OBSERVATION CHECKLIST  |  PAGE {page_number}/{total_pages}"
    c.drawRightString(PAGE_WIDTH - 12 * mm, 6.2 * mm, footer)


def draw_cover(c):
    c.setFillColor(OBSIDIAN)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)

    # restrained contour rings
    c.saveState()
    c.setStrokeColor(colors.Color(232 / 255, 213 / 255, 181 / 255, alpha=0.15))
    c.setLineWidth(0.8)
    center_x, center_y = PAGE_WIDTH * 0.82, PAGE_HEIGHT * 0.60
    for radius in (35, 52, 70, 90, 112, 136):
        c.ellipse(
            center_x - radius * 1.15,
            center_y - radius * 0.78,
            center_x + radius * 1.15,
            center_y + radius * 0.78,
            stroke=1,
            fill=0,
        )
    c.restoreState()

    draw_brand(c, 17 * mm, PAGE_HEIGHT - 24 * mm)
    c.setFillColor(EMBER)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(17 * mm, PAGE_HEIGHT - 42 * mm, "FREE PRINTABLE FIELD NOTE  |  30 DAYS")

    c.setFillColor(SAND)
    c.setFont("Helvetica-Bold", 35)
    c.drawString(17 * mm, PAGE_HEIGHT - 65 * mm, "Pet behavior")
    c.drawString(17 * mm, PAGE_HEIGHT - 82 * mm, "observation checklist.")

    c.setFillColor(MOSS)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(17 * mm, PAGE_HEIGHT - 101 * mm, "No diagnosis required, no labeling needed, just record-keeping")

    c.setFillColor(colors.Color(232 / 255, 213 / 255, 181 / 255, alpha=0.68))
    text = c.beginText(17 * mm, PAGE_HEIGHT - 116 * mm)
    text.setFont("Helvetica", 9)
    text.setLeading(13)
    text.textLine("Notice ordinary patterns in diet, sleep, social responses,")
    text.textLine("stress signals, and play or enrichment preferences.")
    c.drawText(text)

    info_x = 17 * mm
    info_y = 38 * mm
    info_w = 166 * mm
    info_h = 42 * mm
    c.setFillColor(colors.Color(232 / 255, 213 / 255, 181 / 255, alpha=0.06))
    c.setStrokeColor(colors.Color(232 / 255, 213 / 255, 181 / 255, alpha=0.25))
    c.rect(info_x, info_y, info_w, info_h, stroke=1, fill=1)
    c.setFillColor(SAND)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(info_x + 6 * mm, info_y + 31 * mm, "PET")
    c.drawString(info_x + 61 * mm, info_y + 31 * mm, "SPECIES")
    c.drawString(info_x + 111 * mm, info_y + 31 * mm, "START DATE")
    c.setStrokeColor(colors.Color(232 / 255, 213 / 255, 181 / 255, alpha=0.30))
    c.line(info_x + 6 * mm, info_y + 17 * mm, info_x + 51 * mm, info_y + 17 * mm)
    c.line(info_x + 61 * mm, info_y + 17 * mm, info_x + 101 * mm, info_y + 17 * mm)
    c.line(info_x + 111 * mm, info_y + 17 * mm, info_x + 158 * mm, info_y + 17 * mm)

    c.setFillColor(colors.Color(232 / 255, 213 / 255, 181 / 255, alpha=0.46))
    c.setFont("Helvetica", 6.8)
    c.drawString(17 * mm, 20 * mm, "Created by WildKind, based on frameworks of animal behavior observation")
    c.drawRightString(PAGE_WIDTH - 17 * mm, 20 * mm, "NOT VETERINARY OR DIAGNOSTIC ADVICE")

    c.showPage()


def draw_quick_guide(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)

    draw_brand(c, 14 * mm, PAGE_HEIGHT - 19 * mm, OBSIDIAN)
    c.setFillColor(EMBER)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(14 * mm, PAGE_HEIGHT - 35 * mm, "HOW TO USE THIS FIELD NOTE")
    c.setFillColor(OBSIDIAN)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(14 * mm, PAGE_HEIGHT - 48 * mm, "Observe the ordinary. Record the context.")

    intro = Paragraph(
        "Choose one consistent time each day. Record what you directly noticed, not what you think the behavior means. "
        "Short, specific notes are more useful than perfect completion.",
        paragraph_style("intro", size=10, leading=14, color=MUTED),
    )
    intro.wrapOn(c, 170 * mm, 30 * mm)
    intro.drawOn(c, 14 * mm, PAGE_HEIGHT - 59 * mm)

    cards = [
        ("01  DESCRIBE", "Write the visible action: ate half the meal, slept near the door, moved away, returned to play."),
        ("02  ADD CONTEXT", "Note what happened just before, who was present, where it occurred, and how long recovery took."),
        ("03  STAY NEUTRAL", "Avoid labels such as stubborn, dominant, jealous, bad, or dramatic. Record what changed instead."),
    ]
    card_y = PAGE_HEIGHT - 105 * mm
    card_w = 84 * mm
    for index, (title, copy) in enumerate(cards):
        x = 14 * mm + index * (card_w + 5 * mm)
        c.setFillColor(WHITE)
        c.setStrokeColor(LINE)
        c.rect(x, card_y, card_w, 42 * mm, stroke=1, fill=1)
        c.setFillColor(EMBER)
        c.setFont("Helvetica-Bold", 7.3)
        c.drawString(x + 5 * mm, card_y + 31 * mm, title)
        p = Paragraph(copy, paragraph_style(f"card-{index}", size=8, leading=11, color=MUTED))
        p.wrapOn(c, card_w - 10 * mm, 25 * mm)
        p.drawOn(c, x + 5 * mm, card_y + 9 * mm)

    c.setFillColor(MOSS)
    c.rect(14 * mm, 36 * mm, 124 * mm, 35 * mm, stroke=0, fill=1)
    c.setFillColor(OBSIDIAN)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(20 * mm, 59 * mm, "No diagnosis required, no labeling needed, just record-keeping")
    statement = Paragraph(
        "This checklist can support clearer conversations with caregivers and professionals. It cannot diagnose a health or behavior condition.",
        paragraph_style("statement", size=7.6, leading=10, color=OBSIDIAN),
    )
    statement.wrapOn(c, 112 * mm, 20 * mm)
    statement.drawOn(c, 20 * mm, 42 * mm)

    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.rect(144 * mm, 36 * mm, 139 * mm, 35 * mm, stroke=1, fill=1)
    c.setFillColor(OBSIDIAN)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(150 * mm, 59 * mm, "WHEN TO SEEK HELP")
    warning = Paragraph(
        "Contact a veterinarian for sudden or marked behavior change, suspected pain or illness, persistent appetite or sleep disruption, "
        "self-injury, severe distress, or behavior that could injure a person or animal.",
        paragraph_style("warning", size=7.6, leading=10, color=MUTED),
    )
    warning.wrapOn(c, 127 * mm, 20 * mm)
    warning.drawOn(c, 150 * mm, 42 * mm)

    draw_footer(c, 2)
    c.showPage()


def checkbox_line(label, options):
    option_text = "  ".join(f"[ ] {option}" for option in options)
    return f"<b>{label}</b> {option_text}"


def chart_cell(lines):
    return Paragraph("<br/>".join(lines), CELL)


def draw_chart_page(c, start_day, page_number):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)

    draw_brand(c, 11 * mm, PAGE_HEIGHT - 17 * mm, OBSIDIAN)
    c.setFillColor(OBSIDIAN)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(92 * mm, PAGE_HEIGHT - 14.5 * mm, f"Daily observations  |  Days {start_day}-{start_day + 9}")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.5)
    c.drawRightString(PAGE_WIDTH - 11 * mm, PAGE_HEIGHT - 14.5 * mm, "Write what happened. Leave blank when not observed.")

    headers = [
        Paragraph("DAY<br/>DATE", HEADER),
        Paragraph("DIET & WATER", HEADER),
        Paragraph("SLEEP & REST", HEADER),
        Paragraph("SOCIAL RESPONSE", HEADER),
        Paragraph("STRESS SIGNALS", HEADER),
        Paragraph("PLAY & ENRICHMENT", HEADER),
        Paragraph("CONTEXT & NOTES", HEADER),
    ]

    data = [headers]
    for day in range(start_day, start_day + 10):
        data.append(
            [
                Paragraph(f"<b>{day:02d}</b><br/><br/>Date: ______", CELL_BOLD),
                chart_cell(
                    [
                        checkbox_line("Appetite:", ["usual", "less", "more"]),
                        checkbox_line("Water:", ["usual", "less", "more"]),
                        "Other: __________________",
                    ]
                ),
                chart_cell(
                    [
                        "Rest estimate: ______ hrs",
                        checkbox_line("", ["settled", "interrupted"]),
                        "Where: __________________",
                    ]
                ),
                chart_cell(
                    [
                        "Who/context: _____________",
                        checkbox_line("", ["approach", "observe", "move away"]),
                        "Other: __________________",
                    ]
                ),
                chart_cell(
                    [
                        "Visible signals: ___________",
                        "Trigger: __________________",
                        "Recovery: ________________",
                    ]
                ),
                chart_cell(
                    [
                        "Offered: __________________",
                        checkbox_line("", ["chose", "brief", "sustained"]),
                        "Preferred: ________________",
                    ]
                ),
                chart_cell(
                    [
                        "Change/event: _____________",
                        "What helped: ______________",
                        "Other: __________________",
                    ]
                ),
            ]
        )

    column_widths = [15 * mm, 38 * mm, 35 * mm, 45 * mm, 49 * mm, 46 * mm, 47 * mm]
    table = Table(data, colWidths=column_widths, rowHeights=[13 * mm] + [14.5 * mm] * 10)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), OBSIDIAN),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 0), (-1, 0), "LEFT"),
                ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                ("BACKGROUND", (0, 1), (-1, -1), WHITE),
                ("BACKGROUND", (0, 2), (-1, 2), colors.HexColor("#EBDFC8")),
                ("BACKGROUND", (0, 4), (-1, 4), colors.HexColor("#EBDFC8")),
                ("BACKGROUND", (0, 6), (-1, 6), colors.HexColor("#EBDFC8")),
                ("BACKGROUND", (0, 8), (-1, 8), colors.HexColor("#EBDFC8")),
                ("BACKGROUND", (0, 10), (-1, 10), colors.HexColor("#EBDFC8")),
                ("LEFTPADDING", (0, 0), (-1, -1), 3.5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3.5),
                ("TOPPADDING", (0, 0), (-1, -1), 3.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
            ]
        )
    )
    table.wrapOn(c, sum(column_widths), 160 * mm)
    table.drawOn(c, 11 * mm, 17 * mm)

    draw_footer(c, page_number)
    c.showPage()


def create_pdf(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(path), pagesize=landscape(A4))
    c.setTitle("WildKind 30-Day Pet Behavior Observation Checklist")
    c.setAuthor("WildKind")
    c.setSubject("Free printable daily pet behavior observation chart")
    c.setKeywords("pet behavior, observation checklist, 30 day tracker, printable")

    draw_cover(c)
    draw_quick_guide(c)
    draw_chart_page(c, 1, 3)
    draw_chart_page(c, 11, 4)
    draw_chart_page(c, 21, 5)
    c.save()


if __name__ == "__main__":
    create_pdf(OUTPUT)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(PUBLIC)
