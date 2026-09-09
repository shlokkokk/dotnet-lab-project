# Academic Registration & Database Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-dotnet--lab--project.onrender.com-0284c7?style=for-the-badge&logo=render&logoColor=white)](https://dotnet-lab-project.onrender.com)
[![Server Status](https://img.shields.io/badge/Ping_Server-Wake_Up_Container-10b981?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet-lab-project.onrender.com/api/health)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shlokkokk/dotnet-lab-project)

---

### Quick Server Wake-Up

> **Note on Render Free Tier**: The backend server enters sleep mode after 15 minutes of inactivity. Click the button below **15–30 seconds before your presentation** to wake up the container:

[![Wake Up Server](https://img.shields.io/badge/%E2%9A%A1_Wake_Up_Server-Click_to_Ping_Backend-2563eb?style=for-the-badge)](https://dotnet-lab-project.onrender.com/api/health)

---

## Project Overview

A unified full-stack academic registration and management platform built for **.NET Technologies** at **The Maharaja Sayajirao University of Baroda (Polytechnic IT)**.

The system demonstrates end-to-end ASP.NET Web Forms architecture, C# ADO.NET data operations, dynamic student elective allocation, responsive feedback collection with interactive star ratings, and an administrator management directory.

---

## Technology Stack

- **Backend Runtime**: C# ASP.NET Core 9.0 (.NET 9.0 Web API)
- **Data Access Engine**: ADO.NET (`Microsoft.Data.Sqlite`, `System.Data.SqlClient`)
- **Database**: SQLite (`academic_portal.db`) with `dbo.regdb`, `dbo.fd_table`, and `student_electives`
- **Frontend Architecture**: React 18, Vite, Vanilla CSS
- **Containerization & Hosting**: Docker Multi-Stage Build on Render

---

## Key Features

1. **Academic Registration Form (`dbo.regdb`)**:
   - 12-column comprehensive profile schema (Name, Email, Mobile, Address, Birthdate, Auto-calculated Age, Gender, Hobbies, User Role, Username, Password, Confirm Password).
   - Enter-key form navigation across fields.
   - Dynamic custom hobbies builder with tag removal.
   - Multi-factor password strength meter with visual progress bar.

2. **Database Management Console**:
   - Dual view modes: **Directory Profile Cards** and **Structured Data Grid (NoWrap Table)**.
   - Live KPI counters (Total Users, Students, Faculty, Admins).
   - Search across names, usernames, emails, and phone numbers.
   - SQL DDL & Seed script generator with copy-to-clipboard.
   - CSV spreadsheet export with confirmation dialogs.

3. **Student Portal & Course Allocation**:
   - Role-gated dashboard for student accounts.
   - Multi-subject elective selector with live persistence.
   - Assignment document upload with file-size and type validation.

4. **Feedback Collection (`dbo.fd_table`)**:
   - Star rating selector with live sentiment indicator.
   - Responsive two-column review card directory.

5. **Backend Architecture & Code Explorer**:
   - Dual-mode developer IDE: Live ADO.NET execution logs and syntax-highlighted source code viewer with line numbers and copy confirmation.

---

## Default Administrator Credentials

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `shlokshah412@gmail.com` *(or `shlok`)* | `Admin@412` |

---

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/shlokkokk/dotnet-lab-project.git
cd dotnet-lab-project
```

### 2. Run .NET Backend API (Port 5000)
```bash
cd DotNetServer
dotnet run
```

### 3. Run React Frontend (Port 3000)
```bash
npm install
npm run dev
```

---

## Deployment Configuration

The application includes a production-grade multi-stage [Dockerfile](Dockerfile) that automatically compiles the React UI into the ASP.NET Core server's static `wwwroot/` folder and hosts the complete system on a single port.
