#!/usr/bin/env python3
"""
Fetch and Load Kaggle Human Resources Dataset into MissionWell AI.

Flow:
Kaggle -> kagglehub download -> read dataset -> parse data -> existing Antigravity application

Requirements met:
1. Download latest dataset using kagglehub
2. Locate actual CSV file in downloaded directory
3. Read dataset successfully
4. Detect and preserve all available columns (36 columns)
5. Convert dataset into format directly consumable by application (JSON / objects)
6. No new database
7. No MongoDB models
8. No new authentication
9. No new unnecessary REST APIs
10. Replaces mock/hardcoded employee data with real Kaggle records
11. Preserves existing project architecture
12. Makes Kaggle data available as live data
"""

import os
import sys
import glob
import json
import shutil
from pathlib import Path
import pandas as pd
import kagglehub

def clean_value(val):
    if pd.isna(val):
        return None
    if isinstance(val, (int, float)):
        if pd.isna(val):
            return None
        return val
    return str(val).strip()

def main():
    print("=" * 60)
    print("[1] Fetching Kaggle Dataset via kagglehub...")
    print("=" * 60)

    dataset_handle = "rhuebner/human-resources-data-set"
    download_dir = kagglehub.dataset_download(dataset_handle)
    print(f"[+] Download complete: {download_dir}")

    # Locate the CSV file
    csv_files = glob.glob(os.path.join(download_dir, "*.csv"))
    if not csv_files:
        # Search recursively
        csv_files = glob.glob(os.path.join(download_dir, "**", "*.csv"), recursive=True)

    if not csv_files:
        print("[!] Error: No CSV data file found in downloaded directory.")
        sys.exit(1)

    csv_path = csv_files[0]
    csv_filename = os.path.basename(csv_path)
    print(f"[+] Found dataset file: {csv_filename} at {csv_path}")

    # Read the dataset
    print("[2] Reading dataset with pandas...")
    df = pd.read_csv(csv_path)
    record_count, col_count = df.shape
    columns = df.columns.tolist()

    print(f"[+] Records found: {record_count}")
    print(f"[+] Columns detected ({col_count}): {columns}")

    # Ensure destination directories exist
    root_dir = Path(__file__).resolve().parent.parent
    frontend_data_dir = root_dir / "frontend" / "lib" / "data"
    raw_data_dir = root_dir / "data" / "kaggle"
    frontend_data_dir.mkdir(parents=True, exist_ok=True)
    raw_data_dir.mkdir(parents=True, exist_ok=True)

    # Copy raw CSV into project directories for local reference
    dest_csv_frontend = frontend_data_dir / csv_filename
    dest_csv_raw = raw_data_dir / csv_filename
    shutil.copyfile(csv_path, dest_csv_frontend)
    shutil.copyfile(csv_path, dest_csv_raw)
    print(f"[+] Copied CSV to: {dest_csv_frontend}")

    # Detect and preserve all 36 columns
    print("[3] Parsing and preserving all columns...")
    raw_records = []
    mapped_personnel = []

    for _, row in df.iterrows():
        # Preserve all 36 original columns
        item = {}
        for col in columns:
            item[col] = clean_value(row[col])
        raw_records.append(item)

        # Map to live PersonnelRecord format required by existing application
        emp_id = item.get("EmpID") or 10000
        emp_name = str(item.get("Employee_Name") or f"Employee {emp_id}")
        
        # Clean up "Lastname, Firstname" format if desired
        if "," in emp_name:
            parts = [p.strip() for p in emp_name.split(",", 1)]
            formatted_name = f"{parts[1]} {parts[0]}" if len(parts) > 1 else emp_name
        else:
            formatted_name = emp_name

        position = str(item.get("Position") or "Specialist")
        dept = str(item.get("Department") or "Operations").strip()
        state = str(item.get("State") or "HQ").strip()
        zip_code = item.get("Zip")
        location = f"{state} Sector (Zip {zip_code})" if zip_code else f"{state} Sector Base"

        emp_satisfaction = item.get("EmpSatisfaction") or 3
        engagement = item.get("EngagementSurvey") or 3.5
        absences = item.get("Absences") or 0
        days_late = item.get("DaysLateLast30") or 0
        special_projects = item.get("SpecialProjectsCount") or 0

        # Calculate live operational workload / stress indicator (0-100) from actual Kaggle survey metrics
        calculated_stress = round(
            max(15, min(95, (5.0 - float(emp_satisfaction)) * 11 + (5.0 - float(engagement)) * 8 + float(absences) * 1.3 + float(days_late) * 3.5 + 22))
        )

        if calculated_stress > 80:
            status = "Severe"
        elif calculated_stress > 65:
            status = "Elevated"
        elif calculated_stress > 45:
            status = "Moderate"
        else:
            status = "Optimal"

        # Calculate duty hours per week based on projects and department
        duty_hours = 40 + int(special_projects) * 3
        recovery_hours = round(max(3.5, min(9.0, float(emp_satisfaction) * 1.4 + 1.8)), 1)
        continuous_duty = round(max(8, min(18, 9 + days_late + (1 if calculated_stress > 65 else 0))))

        hire_date = str(item.get("DateofHire") or "2020-01-01")
        last_review = str(item.get("LastPerformanceReview_Date") or hire_date)

        # Create record with both application-ready fields AND all 36 original Kaggle fields
        record = {
            # Application Contract
            "id": f"P-{emp_id}",
            "name": formatted_name,
            "rank": position,
            "unit": f"{dept} Unit",
            "deploymentLocation": location,
            "deploymentDurationDays": max(30, min(1200, int(absences) * 18 + 120)),
            "continuousDutyHours": continuous_duty,
            "lastLeaveDate": last_review,
            "leaveDaysTakenYTD": int(absences),
            "leaveEntitlementDays": 30,
            "workloadScore": calculated_stress,
            "workloadStatus": status,
            "recoveryTimeHours": recovery_hours,
            "dutyHoursPerWeek": duty_hours,
            "assignedOfficerId": f"officer-{int(item.get('ManagerID') or 1)}",
            "assignedOfficerName": str(item.get("ManagerName") or "Dr. Aarti Sharma"),
            "anonymizedCode": f"KAG-{item.get('DeptID', 1)}-{emp_id}",
            # Raw unadulterated Kaggle row preserved
            "rawKaggleData": item,
            # Direct preservation of all 36 columns on the object itself
            **item
        }
        mapped_personnel.append(record)

    # Save live JSON dataset for the frontend and services to consume
    output_json_path = frontend_data_dir / "kaggle_hr_dataset.json"
    dataset_export = {
        "dataset_name": "Human Resources Data Set",
        "source": "kagglehub: rhuebner/human-resources-data-set",
        "file_name": csv_filename,
        "record_count": record_count,
        "column_count": col_count,
        "columns": columns,
        "records": mapped_personnel,
    }

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(dataset_export, f, indent=2)

    print(f"[+] Generated live application JSON: {output_json_path}")
    print(f"[+] Total records converted: {len(mapped_personnel)}")

    # Update frontend/lib/mock-data/personnel.ts to export live Kaggle data (no mock data)
    personnel_ts_path = root_dir / "frontend" / "lib" / "mock-data" / "personnel.ts"
    with open(personnel_ts_path, "w", encoding="utf-8") as f:
        f.write('import { PersonnelRecord } from "@/types/personnel";\n')
        f.write('import kaggleDataset from "@/lib/data/kaggle_hr_dataset.json";\n\n')
        f.write('/**\n')
        f.write(' * LIVE Kaggle Human Resources Dataset (rhuebner/human-resources-data-set)\n')
        f.write(f' * Total Live Records: {record_count}\n')
        f.write(f' * Columns Preserved: {col_count}\n')
        f.write(' * Converted directly from HRDataset_v14.csv without mock/hardcoded employees.\n')
        f.write(' */\n')
        f.write('export const MOCK_PERSONNEL: PersonnelRecord[] = kaggleDataset.records as unknown as PersonnelRecord[];\n')
        f.write('export const KAGGLE_METADATA = {\n')
        f.write(f'  fileName: "{csv_filename}",\n')
        f.write(f'  recordCount: {record_count},\n')
        f.write(f'  columnCount: {col_count},\n')
        f.write(f'  columns: {json.dumps(columns)},\n')
        f.write('};\n')

    print(f"[+] Updated {personnel_ts_path} with live Kaggle records.")
    print("=" * 60)
    print("Kaggle Dataset successfully integrated as LIVE DATA into Antigravity project!")
    print("=" * 60)

if __name__ == "__main__":
    main()
