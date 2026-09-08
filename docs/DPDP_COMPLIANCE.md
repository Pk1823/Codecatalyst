# MISSIONWELL AI — DPDP Act 2023 & Privacy Safeguards

**Digital Personal Data Protection (DPDP) Act 2023 Compliance Framework**  
*Organization: Ministry of Home Affairs | Department: CRPF, Police II Division*

---

## 1. Statutory Grounding & Ethical Boundaries
The **MISSIONWELL AI** platform is engineered specifically for uniformed personnel welfare support. In strict adherence to the **Digital Personal Data Protection Act 2023 (DPDP)** and the Constitution of India:

1. **Purpose Limitation**: Personal wellness assessments and wearable/operational telemetry are collected exclusively for personnel welfare, fatigue mitigation, and duty rotation pacing.
2. **Non-Disciplinary Firewall**: No wellness disclosures or risk indicators may be entered into Annual Confidential Reports (ACR), court of inquiry proceedings, or promotion review files.
3. **Explicit Consent**: Every wellness assessment requires explicit voluntary opt-in before submission. Consent records are immutably logged in the database (`Consent` entity).

---

## 2. Role-Based Data Separation Matrix

| Role | Access Level | Granular Survey Responses | Clinical Notes | Unit Heatmap |
| :--- | :--- | :--- | :--- | :--- |
| **PERSONNEL** | Self Record Only | Full (Own Only) | None | None |
| **WELFARE_OFFICER** | Authorized Assigned Cases | Yes (Authorized Cases) | Full (Read/Write) | Aggregated |
| **COMMANDER** | Unit Readiness | **REDACTED (Hidden)** | **REDACTED (Hidden)** | Full Unit View |
| **ADMIN** | System Operations & Audit | Redacted (Unless auditing) | None | System Activity |

---

## 3. Cryptographic Audit Logging
Every access to sensitive personnel records, login, assessment submission, triage case update, and intervention creation is immutably recorded in the `AuditLog` table with:
- `actorId` and `actorRole`
- `action` (e.g. `USER_LOGIN`, `SUBMIT_ASSESSMENT`, `RECORD_INTERVENTION`)
- `resource` and `resourceId`
- `timestamp`
- Anonymized metadata context
