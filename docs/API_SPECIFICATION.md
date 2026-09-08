# MISSIONWELL AI — REST API Specification

**AI-Based Predictive Personnel Stress and Welfare Monitoring System for Uniformed Forces**  
*Organization: Ministry of Home Affairs | Department: CRPF, Police II Division*

---

## Base URLs
- **Backend API**: `http://localhost:5000/api`
- **Frontend Integrated API**: `http://localhost:3000/api`
- **ML Microservice**: `http://localhost:8000`

---

## 1. Authentication & Session Management

### `POST /api/auth/login`
- **Description**: Authenticates user via credentials or 1-click persona. Issues signed HTTP-only JWT cookie (`missionwell_session`).
- **Body**:
  ```json
  { "role": "WELFARE_OFFICER", "email": "dr.sharma.aarti@crpf.gov.in", "password": "demo123" }
  ```
- **Response**: `200 OK`
  ```json
  { "success": true, "token": "<JWT>", "user": { "id": "...", "name": "...", "role": "WELFARE_OFFICER" } }
  ```

### `POST /api/auth/logout`
- **Description**: Clears session cookie and writes audit log.
- **Response**: `200 OK`

### `GET /api/auth/session`
- **Description**: Returns currently authenticated session payload.
- **Response**: `200 OK`

---

## 2. Personnel Records & Boundaries

### `GET /api/personnel`
- **Access**: `PERSONNEL` (own record only), `WELFARE_OFFICER`, `COMMANDER`, `ADMIN` (unit roster).
- **Response**: `200 OK` with list of personnel.

### `GET /api/personnel/:id`
- **Access**: Strictly checked against data boundaries (`canAccessPersonnel`).
- **Privacy Safeguard**: If requester is `COMMANDER`, individual `wellnessAssessments` are redacted (`false`).

---

## 3. Voluntary Wellness Assessment

### `POST /api/wellness/assessments`
- **Access**: `PERSONNEL`
- **Description**: Submits voluntary wellness survey, triggers ML evaluation, saves prediction, SHAP factors, recommendations, and opens triage case if high risk.
- **Response**: `201 Created`

### `GET /api/wellness/assessments`
- **Access**: Authenticated users (Personnel restricted to own assessments).
- **Response**: `200 OK`

### `GET /api/wellness/history`
- **Query**: `?timeframe=7D|30D|90D`
- **Response**: `200 OK` with time-series trends.

---

## 4. Machine Learning & Risk Scoring

### `POST /api/risk/predict`
- **Access**: Authenticated
- **Body**: `{ "personnelId": "P-1024", "telemetry": { ... } }`
- **Response**: `200 OK` with riskScore, riskLevel, factors, recommendations.

### `GET /api/risk/history`
- **Access**: Authenticated
- **Response**: `200 OK` with force-wide risk distribution and latest personnel analyses.

---

## 5. Welfare Case Management

### `GET /api/welfare/cases`
- **Access**: `WELFARE_OFFICER`, `ADMIN`. *(Forbidden for `PERSONNEL` -> 403)*.
- **Response**: `200 OK` with list of active cases, case notes, and support actions.

### `POST /api/welfare/cases`
- **Access**: `WELFARE_OFFICER`, `ADMIN`. *(Forbidden for `PERSONNEL` -> 403)*.
- **Response**: `201 Created`

### `PATCH /api/welfare/cases/:id`
- **Access**: `WELFARE_OFFICER`, `ADMIN`
- **Body**: `{ "status": "REVIEWING", "noteText": "Contacted unit commander..." }`
- **Response**: `200 OK`

### `POST /api/welfare/support-actions`
- **Access**: `WELFARE_OFFICER`, `ADMIN`
- **Body**: `{ "caseId": "...", "actionType": "Duty Pacing", "title": "Field Stand-Down", "description": "..." }`
- **Response**: `201 Created`

---

## 6. Operational Reports & Early Warnings

### `GET /api/reports`
- **Access**: `WELFARE_OFFICER`, `COMMANDER`, `ADMIN`. *(Forbidden for `PERSONNEL` -> 403)*.
- **Response**: `200 OK` with aggregated unit summaries, workload averages, and monthly trends.

### `GET /api/alerts`
- **Access**: `WELFARE_OFFICER`, `COMMANDER`, `ADMIN`
- **Response**: `200 OK` with early warning triggers.

---

## 7. Audit Logging

### `GET /api/audit-logs`
- **Access**: `ADMIN` only. *(Forbidden for non-admin -> 403)*.
- **Response**: `200 OK` with immutable audit trail.
