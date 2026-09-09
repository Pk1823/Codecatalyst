import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
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
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "MISSIONWELL AI — SIH JUDGE PRESENTATION & DEFENSE GUIDE")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 36, "Smart India Hackathon (SIH) Defense Briefing • Confidential")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        
        self.restoreState()

def generate_sih_pdf(filename="SIH_Judge_Presentation_QA_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#059669"),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    q_title_style = ParagraphStyle(
        'QTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        leftIndent=10,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4
    )

    story = []

    # Header Title
    story.append(Paragraph("MISSIONWELL AI — SIH DEFENSE Q&A GUIDE", title_style))
    story.append(Paragraph("Predictive Stress & Welfare Monitoring System for Indian Armed Forces & CAPF", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#059669"), spaceAfter=8))

    # SECTION 1
    story.append(Paragraph("1. ELEVATOR PITCH & PROBLEM OVERVIEW", h1_style))
    
    story.append(Paragraph("Q1: 60-Second Elevator Pitch", q_title_style))
    story.append(Paragraph("• <b>What It Is:</b> Defense-grade predictive welfare & operational readiness platform for Indian Armed Forces and CAPF.", bullet_style))
    story.append(Paragraph("• <b>Core Innovation:</b> Replaces reactive welfare with proactive early-warning intelligence using LightGBM AI & SHAP explainability.", bullet_style))
    story.append(Paragraph("• <b>Privacy Shield:</b> 100% DPDP Act 2023 compliant — zero ACR/APAR career prejudice.", bullet_style))

    story.append(Paragraph("Q2: What exact problem does this solve for MHA?", q_title_style))
    story.append(Paragraph("• <b>Current Gap:</b> 14-hr duty, extreme terrains (-35°C Siachen, LWE Bastar), and sleep debt. Existing checkups are reactive; Jawans suppress stress out of career fear.", bullet_style))
    story.append(Paragraph("• <b>Solution:</b> Delivers early risk indicators to Welfare Doctors while providing anonymized, aggregate readiness heatmaps to Commanders.", bullet_style))

    # SECTION 2
    story.append(Paragraph("2. SYSTEM ARCHITECTURE & TECH STACK", h1_style))

    story.append(Paragraph("Q3: Overall System Architecture", q_title_style))
    story.append(Paragraph("• <b>Frontend:</b> Next.js 16 (React 19, TypeScript, Tailwind CSS) with #090D16 military night-vision mode.", bullet_style))
    story.append(Paragraph("• <b>Backend API:</b> Node.js Express (TypeScript, Prisma ORM, Jose JWT auth, SHA-256 audit logging).", bullet_style))
    story.append(Paragraph("• <b>AI Microservice:</b> Python FastAPI (Port 8000) running LightGBM & SHAP TreeExplainer (<15ms latency).", bullet_style))
    story.append(Paragraph("• <b>Database:</b> SQLite (dev.db) for evaluation / PostgreSQL for production.", bullet_style))

    story.append(Paragraph("Q4: Why separate the Python ML microservice from Node.js?", q_title_style))
    story.append(Paragraph("• <b>Independent Scaling:</b> ML engine scales horizontally during surge assessments without impacting web traffic.", bullet_style))
    story.append(Paragraph("• <b>Ecosystem Standard:</b> Python provides native support for LightGBM, SHAP, and NumPy.", bullet_style))
    story.append(Paragraph("• <b>Low Latency:</b> FastAPI async execution returns predictions in under 15ms.", bullet_style))

    story.append(Paragraph("Q5: Multi-Branch Force Customization", q_title_style))
    story.append(Paragraph("• Dynamic adaptation of mottos, rank structures, badges, and terminology across <b>CRPF, Indian Army, BSF, ITBP, CISF, and State Police</b>.", bullet_style))

    # SECTION 3
    story.append(Paragraph("3. MACHINE LEARNING & EXPLAINABLE AI (XAI)", h1_style))

    story.append(Paragraph("Q6: Why LightGBM instead of Deep Learning or Logistic Regression?", q_title_style))
    story.append(Paragraph("• <b>Tabular Data Superiority:</b> Gradient Boosted Trees outperform neural networks on tabular physiological/duty telemetry.", bullet_style))
    story.append(Paragraph("• <b>Efficiency:</b> Handles complex non-linear feature interactions without GPU requirements.", bullet_style))
    story.append(Paragraph("• <b>Native XAI:</b> Direct support for exact SHAP TreeExplainer attribution.", bullet_style))

    story.append(Paragraph("Q7: Model Performance Metrics (77.9% Raw, 78.4% Balanced, F1 0.773)", q_title_style))
    story.append(Paragraph("• <b>Calibrated Precision:</b> Deliberately calibrated to model real-world physiological stress transitions.", bullet_style))
    story.append(Paragraph("• <b>No Overfitting:</b> 99% accuracy on clinical data indicates data leakage; 78% balanced accuracy guarantees reliable, un-inflated real-world risk detection.", bullet_style))

    story.append(Paragraph("Q8: SHAP Feature Attribution", q_title_style))
    story.append(Paragraph("• <b>Targeted Insights:</b> Breaks down risk scores into exact drivers (e.g. +32 pts Sleep Debt, +24 pts Continuous Deployment, +15 pts Leave Denial).", bullet_style))
    story.append(Paragraph("• <b>Actionable Care:</b> Enables doctors to prescribe targeted duty rotations instead of generic advice.", bullet_style))

    story.append(Paragraph("Q9: Anti-Symptom-Masking Guardrail", q_title_style))
    story.append(Paragraph("• <b>False-Bravado Detection:</b> Flags surveys completed in <15 seconds when baseline resting heart rate or duty hours are elevated.", bullet_style))

    # SECTION 4
    story.append(Paragraph("4. DPDP ACT 2023 COMPLIANCE & PRIVACY", h1_style))

    story.append(Paragraph("Q10: DPDP Act 2023 & Zero ACR/APAR Damage", q_title_style))
    story.append(Paragraph("• <b>Commander Isolation:</b> Individual survey responses and clinical notes return HTTP 403 Forbidden to Commander accounts.", bullet_style))
    story.append(Paragraph("• <b>Anonymized Command View:</b> Commanders see only battalion-level aggregate heatmaps.", bullet_style))
    story.append(Paragraph("• <b>Audit Ledger:</b> Every query is logged with SHA-256 hashes for System Admin auditing.", bullet_style))

    # RBAC Table
    matrix_data = [
        [Paragraph("<b>Role</b>", body_style), Paragraph("<b>Individual Data</b>", body_style), Paragraph("<b>Clinical Notes</b>", body_style), Paragraph("<b>Unit Heatmaps</b>", body_style)],
        [Paragraph("<b>Personnel (Jawan)</b>", body_style), Paragraph("Own Data Only", body_style), Paragraph("Private Self-Care", body_style), Paragraph("Blocked (403)", body_style)],
        [Paragraph("<b>Welfare Officer</b>", body_style), Paragraph("Assigned Dossiers", body_style), Paragraph("Doctor-Patient Only", body_style), Paragraph("Full Triage View", body_style)],
        [Paragraph("<b>Commander (CO)</b>", body_style), Paragraph("<b>Strictly Blocked</b>", body_style), Paragraph("<b>Strictly Blocked</b>", body_style), Paragraph("Anonymized Unit", body_style)],
        [Paragraph("<b>System Admin</b>", body_style), Paragraph("Blocked", body_style), Paragraph("Blocked", body_style), Paragraph("Audit & System Health", body_style)]
    ]
    t = Table(matrix_data, colWidths=[120, 120, 134, 130])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(Spacer(1, 4))
    story.append(t)
    story.append(Spacer(1, 6))

    # SECTION 5
    story.append(Paragraph("5. UNIQUE DOMAIN FEATURES & TRICKY QUESTIONS", h1_style))

    story.append(Paragraph("Q11: Buddy-Pair System (बडी-पेयर)", q_title_style))
    story.append(Paragraph("• 1-tap confidential peer check-in ('साथी को विश्राम / सहायता की आवश्यकता है') to support buddies in high-stress zones.", bullet_style))

    story.append(Paragraph("Q12: Confidential Digital Sainik Darbar", q_title_style))
    story.append(Paragraph("• Direct digital request routing to bypass multi-tier rank hierarchy friction.", bullet_style))

    story.append(Paragraph("Q13: Remote / Zero-Connectivity Deployment (Siachen / Thar BOP)?", q_title_style))
    story.append(Paragraph("• <b>Answer:</b> Offline-first PWA architecture with local SQLite storage. Telemetry syncs in encrypted batches when network connectivity is restored.", bullet_style))

    story.append(Paragraph("Q14: What if a Commander demands individual mental health scores?", q_title_style))
    story.append(Paragraph("• <b>Answer:</b> Enforced HTTP 403 Forbidden at backend API level under DPDP Act Section 8(4). CO gets unit-level operational relief metrics only.", bullet_style))

    story.append(Paragraph("Q15: Does this replace military psychiatrists?", q_title_style))
    story.append(Paragraph("• <b>Answer:</b> No. It is a decision-support early-triaging tool that maximizes the efficiency and reach of limited medical personnel.", bullet_style))

    story.append(Paragraph("Q16: System Scalability across 10 Lakh CAPF Personnel?", q_title_style))
    story.append(Paragraph("• <b>Answer:</b> Stateless Node.js containers, PostgreSQL database indexing, and lightweight LightGBM microservice (~15ms response) ready for Kubernetes cluster deployment.", bullet_style))

    # SECTION 6
    story.append(Paragraph("6. RECOMMENDED LIVE DEMO FLOW", h1_style))
    story.append(Paragraph("1. <b>Google OAuth Login:</b> Select evaluator role (Doctor / Commander / Jawan).", bullet_style))
    story.append(Paragraph("2. <b>Jawan Assessment:</b> Complete assessment -> Trigger LightGBM score & SHAP drivers.", bullet_style))
    story.append(Paragraph("3. <b>Welfare Triage:</b> Doctor views confidential case & adds clinical notes.", bullet_style))
    story.append(Paragraph("4. <b>Commander View:</b> View anonymized battalion heatmap & download official MHA report.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated clean PDF at: {os.path.abspath(filename)}")

if __name__ == "__main__":
    generate_sih_pdf()
