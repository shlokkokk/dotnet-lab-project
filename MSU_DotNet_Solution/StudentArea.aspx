<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="StudentArea.aspx.cs" Inherits="MSU_DotNet_Web.StudentArea" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Student Portal | MSU Polytechnic</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
        .header { background: #0f2b48; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
        .sidebar { width: 220px; background: #1e293b; color: white; min-height: calc(100vh - 60px); float: left; padding-top: 20px; }
        .sidebar a { display: block; color: #cbd5e1; padding: 12px 20px; text-decoration: none; font-size: 14px; border-left: 3px solid transparent; }
        .sidebar a:hover { background: #334155; color: white; border-left-color: #0284c7; }
        .content { margin-left: 240px; padding: 30px; }
        .card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 20px; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="header">
            <div><strong>Maharaja Sayajirao University | Student Area</strong></div>
            <div>
                <asp:Label ID="lblUser" runat="server" Text="Welcome"></asp:Label>
                <asp:LinkButton ID="btnLogout" runat="server" OnClick="btnLogout_Click" style="color: #f87171; margin-left: 15px; text-decoration: none;">Logout</asp:LinkButton>
            </div>
        </div>

        <div class="sidebar">
            <a href="StudentArea.aspx">Dashboard</a>
            <a href="ListOfCourses.aspx">List of Courses</a>
            <a href="Subjects.aspx">Subjects &amp; Electives</a>
            <a href="UploadFile.aspx">Upload Profile Photo</a>
            <a href="Feedback.aspx">Laboratory Feedback</a>
        </div>

        <div class="content">
            <div class="card">
                <h2>Welcome to Your Student Area</h2>
                <p>You are logged into the MSU Polytechnic IT Academic Information Portal. Your session is active.</p>
                <div style="background: #e0f2fe; padding: 15px; border-radius: 6px; border-left: 4px solid #0284c7; color: #0369a1;">
                    <strong>Session Parameter:</strong> <asp:Label ID="lblSessionVal" runat="server"></asp:Label>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
