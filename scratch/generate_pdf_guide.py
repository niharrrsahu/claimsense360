import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#173B32"))
        
        # Header Banner text (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "ClaimSense 360 | Master Technical Architecture & Defense Guide")
            self.setStrokeColor(colors.HexColor("#173B32"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
        
        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#555555"))
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY — FOR ENTERPRISE / DEFENSE EVALUATION")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.setStrokeColor(colors.HexColor("#DDDDDD"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#173B32")      # Deep Forest Green
    ACCENT = colors.HexColor("#E66A4E")       # Terracotta Orange
    DARK = colors.HexColor("#101412")         # Text Charcoal
    LIGHT_BG = colors.HexColor("#F4F1EA")     # Premium Warm Sand
    MUTED = colors.HexColor("#555555")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=ACCENT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=ACCENT,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=PRIMARY,
        backColor=LIGHT_BG,
        borderColor=colors.HexColor("#DCD7CC"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # Title Banner
    story.append(Paragraph("ClaimSense 360: Enterprise AI Insurance Claims Intelligence Platform", title_style))
    story.append(Paragraph("MASTER TECHNICAL ARCHITECTURE, AI/ML SPECIFICATIONS & DEFENSE MANUAL", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=0, spaceAfter=12))

    # Executive Summary Card
    exec_summary_text = (
        "<b>Executive Overview:</b> ClaimSense 360 is an Enterprise & Government-Grade AI Motor Insurance "
        "Claims Intelligence and Anti-Fraud Decisioning Platform. It automates end-to-end evaluation using a "
        "multi-modal artificial intelligence engine combining Tabular Machine Learning (XGBoost), Game-Theoretic "
        "Explainability (SHAP), Natural Language Processing Deception Detection (TF-IDF NLP), and Deep Learning "
        "Computer Vision (Ultralytics YOLOv8 + PyTorch ResNet-18) alongside Digital Image Forensics (EXIF Anti-Spoofing)."
    )
    summary_table = Table([[Paragraph(exec_summary_text, body_style)]], colWidths=[504])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # Section 1
    story.append(Paragraph("1. Industry Problem & Executive Rationale", h1_style))
    story.append(Paragraph("<b>The ₹45,000 Crore Annual Loss:</b> In India alone, motor insurance fraud causes losses exceeding ₹45,000 Crore ($5.4 Billion USD) annually due to staged collisions, inflated repair estimates, and recycled damage images.", bullet_style))
    story.append(Paragraph("<b>Failure of Legacy Rule-Based Systems:</b> Traditional insurance platforms rely on static IF-THEN rules (e.g., 'If claim > ₹1 Lakh, send to surveyor'), which fraud syndicates easily bypass.", bullet_style))
    story.append(Paragraph("<b>The Black-Box AI Problem Solved:</b> Regulators (IRDAI/DPDP) reject black-box AI scores. ClaimSense 360 solves this by offering mathematical feature-level SHAP explainability and EXIF anti-spoofing telemetry.", bullet_style))
    story.append(Spacer(1, 8))

    # Section 2
    story.append(Paragraph("2. Full-Stack Architecture & Technology Stack", h1_style))
    story.append(Paragraph("ClaimSense 360 uses a modern decoupled microservices architecture:", body_style))

    arch_data = [
        ["Layer", "Technology Used", "Role & Function"],
        ["Frontend Portal", "Next.js 15.1 + React 19 + TypeScript + Tailwind CSS", "Sub-second responsive App Router UI, type-safe state, Recharts analytics."],
        ["Backend Service", "Python 3.13 + FastAPI 0.110 + Uvicorn ASGI", "Async REST microservice, SQLite DB (SQLAlchemy ORM), JWT Bearer auth."],
        ["Tabular ML", "XGBoost 2.0 + SHAP 0.44 TreeExplainer", "Claim fraud probability scoring + game-theoretic marginal contribution."],
        ["NLP Engine", "TF-IDF Vectorizer + Ridge Regression", "Incident description deception detection & 1-gram/2-gram phrase extraction."],
        ["Computer Vision", "Ultralytics YOLOv8 + PyTorch ResNet-18", "22-class vehicle damage object detection + L2 deep feature vector norm."],
        ["Forensics", "PIL EXIF Telemetry Inspector", "Scans raw camera headers to catch web/Google downloaded stock photos."]
    ]
    arch_table = Table(arch_data, colWidths=[90, 190, 224])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DCD7CC")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 10))

    # Section 3
    story.append(Paragraph("3. AI/ML Engine Models & Mathematical Foundations", h1_style))
    story.append(Paragraph("<b>3.1 XGBoost Fraud Classification Engine:</b> Trained on 1,000 real motor insurance claims across 46 financial and demographic features.", bullet_style))
    story.append(Paragraph("<b>3.2 SHAP Explainability Formula:</b> Calculates exact marginal feature contribution using game theory:", bullet_style))
    story.append(Paragraph("phi_i(v) = SUM_{S subseteq N \\ {i}} [ |S|!(|N|-|S|-1)! / |N|! ] * [ v(S union {i}) - v(S) ]", code_style))
    story.append(Paragraph("<b>3.3 Computer Vision Damage Severity Formula:</b> Combined YOLOv8 + ResNet-18 score:", bullet_style))
    story.append(Paragraph("Severity Score = 0.50 * S_YOLO + 30 * C_ResNet + 20 * E_Gradient", code_style))
    story.append(Paragraph("<b>3.4 Digital Image Forensics & EXIF Anti-Spoofing:</b> Detects missing smartphone camera headers on web-downloaded images, automatically adding +1.850 to SHAP risk and flagging High Risk for SIU audit.", bullet_style))
    story.append(Spacer(1, 10))

    # Section 4
    story.append(Paragraph("4. Datasets Integrated", h1_style))
    story.append(Paragraph("<b>4.1 Kaggle Insurance Claims Real Dataset:</b> 1,000 real motor insurance claim records (located at backend/app/data/insurance_claims_real.csv). Seeded 15 authentic Kaggle policy records into SQLite DB with natural customer names mapped to real policy IDs (POL-521585, POL-342868).", bullet_style))
    story.append(Paragraph("<b>4.2 Roboflow Universe Car Damage Dataset:</b> 32,664 annotated vehicle damage images across 22 damage classes (front-bumper-dent, headlight-shatter, side-fender-crush, etc.).", bullet_style))
    story.append(Spacer(1, 10))

    # Section 5
    story.append(Paragraph("5. Page-by-Page Portal Overview", h1_style))
    story.append(Paragraph("<b>1. Executive Dashboard (http://localhost:3000):</b> 4 Live KPI Stat Cards, Interactive Risk Simulator, Portfolio Risk Chart.", bullet_style))
    story.append(Paragraph("<b>2. Claims Directory (http://localhost:3000/claims):</b> Live search by customer name, policy number, or vehicle model with direct View Detail actions.", bullet_style))
    story.append(Paragraph("<b>3. Single Claim 360 Inspector (http://localhost:3000/claims/[id]):</b> Policy Info Card, Incident Details Card, Uploaded Damage Photo Evidence Card, SHAP Math Factor Bars, and EXIF Forensics Warning Badge.", bullet_style))
    story.append(Paragraph("<b>4. Claim Intake Form (http://localhost:3000/claims/new):</b> Form presets for Nihar Sahu (Hyundai Creta) & Shubhansu Sahu (Suzuki Access), image upload dropzone, and sub-second execution.", bullet_style))
    story.append(Paragraph("<b>5. SIU Fraud Queue (http://localhost:3000/fraud):</b> Interactive Severity Filter Tabs (All Flagged, Critical Risk >= 78, Major Risk 50-77).", bullet_style))
    story.append(Paragraph("<b>6. Portfolio Analytics (http://localhost:3000/analytics):</b> Loss ratio bar charts and monthly risk trends.", bullet_style))
    story.append(Paragraph("<b>7. AI Copilot (http://localhost:3000/copilot):</b> Conversational AI claims intelligence assistant.", bullet_style))
    story.append(Spacer(1, 10))

    # Section 6
    story.append(Paragraph("6. System Hardware Specifications", h1_style))
    
    spec_data = [
        ["Component", "Minimum Hardware", "Recommended / Actual Test Specs"],
        ["CPU Processor", "Intel i5 (4 Cores) or AMD Ryzen 5", "AMD Ryzen 7 8845HS / 7000 Series (8 Cores / 16 Threads)"],
        ["RAM Memory", "8 GB DDR4", "16 GB DDR5"],
        ["GPU Graphics", "Integrated Intel UHD / AMD Radeon", "NVIDIA GeForce RTX 4060 Laptop GPU (8GB VRAM, CUDA 12+)"],
        ["Storage Space", "5 GB available SSD space", "NVMe M.2 High-Speed SSD"],
        ["Operating System", "Windows 10 / 11 64-bit, macOS, Linux", "Windows 11 Home 64-bit"],
        ["Runtimes", "Node.js v18+, Python 3.10+", "Node.js v20+, Python 3.13"]
    ]
    spec_table = Table(spec_data, colWidths=[100, 190, 214])
    spec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DCD7CC")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 10))

    # Section 7
    story.append(Paragraph("7. How to Start and Stop the Application", h1_style))
    story.append(Paragraph("<b>To Start Next.js Frontend Server (Port 3000):</b>", body_style))
    story.append(Paragraph("cd \"c:\\Users\\NIHAR\\Documents\\AD Research\\CLAUDE AI\\files\\ANTIGRAVITY\\claimsense360\"\nnpm run dev", code_style))
    story.append(Paragraph("<b>To Start Python FastAPI Backend Server (Port 8000):</b>", body_style))
    story.append(Paragraph("cd \"c:\\Users\\NIHAR\\Documents\\AD Research\\CLAUDE AI\files\\ANTIGRAVITY\\claimsense360\\backend\"\npython -m uvicorn app.main:app --host 127.0.0.1 --port 8000", code_style))
    story.append(Paragraph("<b>To Stop the Servers:</b> Press CTRL + C in terminals, or force terminate port 8000 via PowerShell using: taskkill /F /PID <PID>", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF at: {filename}")

if __name__ == "__main__":
    out_pdf1 = r"c:\Users\NIHAR\Documents\AD Research\CLAUDE AI\files\ANTIGRAVITY\claimsense360\ClaimSense360_Master_Defense_and_Architecture_Guide.pdf"
    out_pdf2 = r"C:\Users\NIHAR\.gemini\antigravity\brain\81465459-2ec2-40ed-9ee2-88183734768d\ClaimSense360_Master_Defense_and_Architecture_Guide.pdf"
    build_pdf(out_pdf1)
    build_pdf(out_pdf2)
