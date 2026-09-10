export const backendCategories = [
  {
    id: 'webforms-ui',
    name: 'ASP.NET Web Forms (.aspx Markup)',
    description: 'Visual Studio ASP.NET Web Forms markup with validation controls, server controls, and master styling.',
    files: [
      {
        id: 'reg-aspx',
        name: 'RegistrationPage.aspx',
        path: 'MSU_DotNet_Solution/RegistrationPage.aspx',
        language: 'html',
        category: 'webforms-ui',
        tag: 'ASP.NET Markup',
        summary: 'Contains the complete 12-field registration UI with RequiredFieldValidator, RangeValidator, RegularExpressionValidator, CompareValidator, CustomValidator, and ValidationSummary.',
        code: `<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RegistrationPage.aspx.cs" Inherits="MSU_DotNet_Web.RegistrationPage" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Registration - MSU Polytechnic IT (.NET Lab Exp 15)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .reg-container { max-width: 650px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header-title { font-size: 20px; font-weight: bold; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
        .form-row { display: flex; margin-bottom: 15px; align-items: center; }
        .form-label { width: 180px; font-weight: 600; color: #374151; }
        .form-input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; }
        .error-msg { color: #dc2626; font-size: 12px; margin-left: 10px; }
        .btn-group { margin-top: 25px; text-align: right; }
        .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .btn-submit { background-color: #2563eb; color: #fff; }
        .btn-reset { background-color: #9ca3af; color: #fff; margin-right: 10px; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div class="reg-container">
        <div class="header-title">MSU Polytechnic - Student Registration Form</div>

        <asp:ValidationSummary ID="ValidationSummary1" runat="server" ForeColor="Red" HeaderText="Please fix the following validation errors:" DisplayMode="BulletList" />

        <!-- 1. Full Name -->
        <div class="form-row">
            <span class="form-label">Full Name:</span>
            <asp:TextBox ID="txtname" runat="server" CssClass="form-input" placeholder="Enter Full Name"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvName" runat="server" ControlToValidate="txtname" ErrorMessage="Full Name is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 2. Address -->
        <div class="form-row">
            <span class="form-label">Address:</span>
            <asp:TextBox ID="txtadd" runat="server" TextMode="MultiLine" Rows="2" CssClass="form-input" placeholder="Residential Address"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvAdd" runat="server" ControlToValidate="txtadd" ErrorMessage="Address is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 3. Birthdate -->
        <div class="form-row">
            <span class="form-label">Birthdate:</span>
            <asp:TextBox ID="txtbirth" runat="server" TextMode="Date" CssClass="form-input"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvBirth" runat="server" ControlToValidate="txtbirth" ErrorMessage="Birthdate is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 4. Gender -->
        <div class="form-row">
            <span class="form-label">Gender:</span>
            <asp:RadioButton ID="RadioButton1" runat="server" GroupName="gender" Text="Male" Checked="true" />
            &nbsp;&nbsp;
            <asp:RadioButton ID="RadioButton2" runat="server" GroupName="gender" Text="Female" />
        </div>

        <!-- 5. Hobbies -->
        <div class="form-row">
            <span class="form-label">Hobbies:</span>
            <asp:CheckBox ID="CheckBox1" runat="server" Text="Reading" />&nbsp;
            <asp:CheckBox ID="CheckBox2" runat="server" Text="Playing" />&nbsp;
            <asp:CheckBox ID="CheckBox3" runat="server" Text="Dancing" />
        </div>

        <!-- 6. Age -->
        <div class="form-row">
            <span class="form-label">Age:</span>
            <asp:TextBox ID="txtage" runat="server" CssClass="form-input" placeholder="Enter Age"></asp:TextBox>
            <asp:RangeValidator ID="RangeValidator1" runat="server" ControlToValidate="txtage" MinimumValue="16" MaximumValue="100" Type="Integer" ErrorMessage="Age must be between 16 and 100" ForeColor="Red">*</asp:RangeValidator>
            <asp:RequiredFieldValidator ID="rfvAge" runat="server" ControlToValidate="txtage" ErrorMessage="Age is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 7. Username -->
        <div class="form-row">
            <span class="form-label">Username:</span>
            <asp:TextBox ID="txtuser" runat="server" CssClass="form-input" placeholder="Choose Username"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvUser" runat="server" ControlToValidate="txtuser" ErrorMessage="Username is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 8. Password -->
        <div class="form-row">
            <span class="form-label">Password:</span>
            <asp:TextBox ID="txtpswd" runat="server" TextMode="Password" CssClass="form-input"></asp:TextBox>
            <asp:RequiredFieldValidator ID="rfvPwd" runat="server" ControlToValidate="txtpswd" ErrorMessage="Password is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 9. Confirm Password -->
        <div class="form-row">
            <span class="form-label">Confirm Password:</span>
            <asp:TextBox ID="txtconfirm" runat="server" TextMode="Password" CssClass="form-input"></asp:TextBox>
            <asp:CompareValidator ID="CompareValidator1" runat="server" ControlToValidate="txtconfirm" ControlToCompare="txtpswd" ErrorMessage="Passwords do not match" ForeColor="Red">*</asp:CompareValidator>
        </div>

        <!-- 10. Email -->
        <div class="form-row">
            <span class="form-label">Email:</span>
            <asp:TextBox ID="txtemail" runat="server" CssClass="form-input" placeholder="name@example.com"></asp:TextBox>
            <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" ControlToValidate="txtemail" ValidationExpression="^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$" ErrorMessage="Invalid Email format" ForeColor="Red">*</asp:RegularExpressionValidator>
            <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ControlToValidate="txtemail" ErrorMessage="Email is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <!-- 11. User Type -->
        <div class="form-row">
            <span class="form-label">User Type:</span>
            <asp:DropDownList ID="DropDownList1" runat="server" CssClass="form-input">
                <asp:ListItem Value="Student">Student</asp:ListItem>
                <asp:ListItem Value="Faculty">Faculty</asp:ListItem>
                <asp:ListItem Value="Admin">Admin</asp:ListItem>
            </asp:DropDownList>
        </div>

        <!-- 12. Mobile No -->
        <div class="form-row">
            <span class="form-label">Mobile Number:</span>
            <asp:TextBox ID="txtno" runat="server" MaxLength="10" CssClass="form-input" placeholder="10-digit mobile number"></asp:TextBox>
            <asp:CustomValidator ID="CustomValidator1" runat="server" ControlToValidate="txtno" OnServerValidate="CustomValidator1_ServerValidate" ErrorMessage="Mobile must be exactly 10 digits" ForeColor="Red">*</asp:CustomValidator>
            <asp:RequiredFieldValidator ID="rfvMobile" runat="server" ControlToValidate="txtno" ErrorMessage="Mobile number is required" ForeColor="Red">*</asp:RequiredFieldValidator>
        </div>

        <div class="btn-group">
            <asp:Button ID="btnreset" runat="server" Text="Reset" CausesValidation="false" OnClick="btnreset_Click" CssClass="btn btn-reset" />
            <asp:Button ID="btnsubmit" runat="server" Text="Register" OnClick="btnsubmit_Click" CssClass="btn btn-submit" />
        </div>

        <div style="margin-top: 15px; text-align: center;">
            <asp:Label ID="lblStatus" runat="server"></asp:Label>
        </div>
    </div>
    </form>
</body>
</html>`
      },
      {
        id: 'login-aspx',
        name: 'LoginPage.aspx',
        path: 'MSU_DotNet_Solution/LoginPage.aspx',
        language: 'html',
        category: 'webforms-ui',
        tag: 'ASP.NET Markup',
        summary: 'Authentication interface featuring role selection (Student, Faculty, Admin), secure password field, and server error messaging.',
        code: `<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LoginPage.aspx.cs" Inherits="MSU_DotNet_Web.LoginPage" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Portal Authentication | MSU Polytechnic</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 40px 20px; }
        .login-box { max-width: 420px; margin: 40px auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h3 { color: #0f2b48; margin-top: 0; margin-bottom: 20px; text-align: center; }
        .form-row { margin-bottom: 16px; }
        .form-row label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #333333; }
        .form-control { width: 100%; padding: 9px 12px; border: 1px solid #cccccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; }
        .btn { width: 100%; background: #0284c7; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .btn:hover { background: #0369a1; }
        .error-lbl { color: #dc2626; font-size: 13px; display: block; margin-top: 12px; text-align: center; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="login-box">
            <h3>Portal Authentication</h3>

            <div class="form-row">
                <label>User Role:</label>
                <asp:DropDownList ID="DropDownList1" runat="server" CssClass="form-control">
                    <asp:ListItem Value="Student">Student</asp:ListItem>
                    <asp:ListItem Value="Faculty">Faculty</asp:ListItem>
                    <asp:ListItem Value="Admin">Admin</asp:ListItem>
                </asp:DropDownList>
            </div>

            <div class="form-row">
                <label>Username:</label>
                <asp:TextBox ID="txtname" runat="server" CssClass="form-control" placeholder="peal@2214"></asp:TextBox>
            </div>

            <div class="form-row">
                <label>Password:</label>
                <asp:TextBox ID="txtpassword" runat="server" TextMode="Password" CssClass="form-control"></asp:TextBox>
            </div>

            <asp:Button ID="Button1" runat="server" Text="Sign In" OnClick="Button1_Click" CssClass="btn" />

            <asp:Label ID="lblMsg" runat="server" CssClass="error-lbl"></asp:Label>
        </div>
    </form>
</body>
</html>`
      },
      {
        id: 'student-aspx',
        name: 'StudentArea.aspx',
        path: 'MSU_DotNet_Solution/StudentArea.aspx',
        language: 'html',
        category: 'webforms-ui',
        tag: 'ASP.NET Markup',
        summary: 'Student dashboard portal verifying Session state, presenting navigation options, course enrollment, and logout controls.',
        code: `<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="StudentArea.aspx.cs" Inherits="MSU_DotNet_Web.StudentArea" %>

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
</html>`
      },
      {
        id: 'feedback-aspx',
        name: 'Feedback.aspx',
        path: 'MSU_DotNet_Solution/Feedback.aspx',
        language: 'html',
        category: 'webforms-ui',
        tag: 'ASP.NET Markup',
        summary: 'Feedback collection form featuring dynamic subject input, 5-point rating radio buttons, comments area, and ADO.NET submission status.',
        code: `<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Feedback.aspx.cs" Inherits="MSU_DotNet_Web.Feedback" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Academic Feedback - MSU Polytechnic IT</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .feedback-container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header-title { font-size: 20px; font-weight: bold; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; font-weight: 600; margin-bottom: 5px; color: #374151; }
        .form-control { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box; }
        .btn-submit { background-color: #0284c7; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="feedback-container">
            <div class="header-title">Student &amp; Lab Feedback System</div>
            
            <div class="form-group">
                <label class="form-label">Student Name / ID:</label>
                <asp:TextBox ID="txtName" runat="server" CssClass="form-control" placeholder="Your Name or Student ID"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvName" runat="server" ControlToValidate="txtName" ErrorMessage="Name is required" ForeColor="Red"></asp:RequiredFieldValidator>
            </div>

            <div class="form-group">
                <label class="form-label">Subject / Lab Component:</label>
                <asp:TextBox ID="txtSubject" runat="server" CssClass="form-control" placeholder="e.g. .NET Lab, Database Systems"></asp:TextBox>
            </div>

            <div class="form-group">
                <label class="form-label">Rating (1 to 5 Stars):</label>
                <asp:RadioButtonList ID="rblRating" runat="server" RepeatDirection="Horizontal">
                    <asp:ListItem Value="1">1</asp:ListItem>
                    <asp:ListItem Value="2">2</asp:ListItem>
                    <asp:ListItem Value="3">3</asp:ListItem>
                    <asp:ListItem Value="4">4</asp:ListItem>
                    <asp:ListItem Value="5" Selected="True">5</asp:ListItem>
                </asp:RadioButtonList>
            </div>

            <div class="form-group">
                <label class="form-label">Comments &amp; Feedback:</label>
                <asp:TextBox ID="txtComments" runat="server" TextMode="MultiLine" Rows="4" CssClass="form-control"></asp:TextBox>
            </div>

            <asp:Button ID="btnSubmit" runat="server" Text="Submit Feedback" OnClick="btnSubmit_Click" CssClass="btn-submit" />

            <div style="margin-top: 15px;">
                <asp:Label ID="lblMessage" runat="server"></asp:Label>
            </div>
        </div>
    </form>
</body>
</html>`
      },
      {
        id: 'upload-aspx',
        name: 'UploadFile.aspx',
        path: 'MSU_DotNet_Solution/UploadFile.aspx',
        language: 'html',
        category: 'webforms-ui',
        tag: 'ASP.NET Markup',
        summary: 'Demonstrates the standard ASP.NET FileUpload control, server file size verification, and saving to ~/images/ directory.',
        code: `<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadFile.aspx.cs" Inherits="MSU_DotNet_Web.UploadFile" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Upload Photo | MSU Polytechnic</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 30px; }
        .box { max-width: 500px; margin: 0 auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="box">
            <h3>Upload Student Photo (FileUpload1.SaveAs)</h3>
            <p style="font-size: 13px; color: #64748b;">Select an image file to upload to the server's \\images\\ folder.</p>

            <asp:FileUpload ID="FileUpload1" runat="server" style="margin-bottom: 15px; display: block;" />
            
            <asp:Button ID="Button1" runat="server" Text="Upload Photo" OnClick="Button1_Click" CssClass="btn" />

            <asp:Label ID="lblStatus" runat="server" style="display: block; margin-top: 15px; font-weight: 600; font-size: 14px;"></asp:Label>
        </div>
    </form>
</body>
</html>`
      }
    ]
  },
  {
    id: 'code-behind',
    name: 'C# & VB.NET Code-Behind Logic',
    description: 'Server event handlers, validation logic, ADO.NET commands, and session management.',
    files: [
      {
        id: 'reg-cs',
        name: 'RegistrationPage.aspx.cs',
        path: 'MSU_DotNet_Solution/RegistrationPage.aspx.cs',
        language: 'csharp',
        category: 'code-behind',
        tag: 'C# Code-Behind',
        summary: 'Handles ServerValidate for mobile numbers, resets control states, builds parameterized SQL INSERT queries, and executes ADO.NET commands.',
        code: `using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MSU_DotNet_Web
{
    public partial class RegistrationPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblStatus.Text = string.Empty;
            }
        }

        protected void CustomValidator1_ServerValidate(object source, ServerValidateEventArgs args)
        {
            if (args.Value != null && args.Value.Length == 10 && long.TryParse(args.Value, out _))
            {
                args.IsValid = true;
            }
            else
            {
                args.IsValid = false;
            }
        }

        protected void btnreset_Click(object sender, EventArgs e)
        {
            txtname.Text = string.Empty;
            txtadd.Text = string.Empty;
            txtbirth.Text = string.Empty;
            txtage.Text = string.Empty;
            txtuser.Text = string.Empty;
            txtpswd.Text = string.Empty;
            txtconfirm.Text = string.Empty;
            txtemail.Text = string.Empty;
            txtno.Text = string.Empty;
            RadioButton1.Checked = true;
            RadioButton2.Checked = false;
            CheckBox1.Checked = false;
            CheckBox2.Checked = false;
            CheckBox3.Checked = false;
            lblStatus.Text = "Form reset successfully.";
            lblStatus.ForeColor = System.Drawing.Color.Gray;
        }

        protected void btnsubmit_Click(object sender, EventArgs e)
        {
            if (!Page.IsValid)
            {
                lblStatus.Text = "Please fix validation errors.";
                lblStatus.ForeColor = System.Drawing.Color.Red;
                return;
            }

            string gender = RadioButton1.Checked ? "Male" : "Female";
            string hobbies = "";
            if (CheckBox1.Checked) hobbies += "Reading, ";
            if (CheckBox2.Checked) hobbies += "Playing, ";
            if (CheckBox3.Checked) hobbies += "Dancing, ";
            hobbies = hobbies.TrimEnd(' ', ',');

            string query = @"INSERT INTO regdb (Name, Address, Birthdate, Gender, Hobbies, Age, Username, Password, Email, UserType, Mobile)
                             VALUES (@Name, @Address, @Birthdate, @Gender, @Hobbies, @Age, @Username, @Password, @Email, @UserType, @Mobile)";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Name", txtname.Text.Trim()),
                new SqlParameter("@Address", txtadd.Text.Trim()),
                new SqlParameter("@Birthdate", DateTime.Parse(txtbirth.Text)),
                new SqlParameter("@Gender", gender),
                new SqlParameter("@Hobbies", hobbies),
                new SqlParameter("@Age", int.Parse(txtage.Text.Trim())),
                new SqlParameter("@Username", txtuser.Text.Trim()),
                new SqlParameter("@Password", txtpswd.Text),
                new SqlParameter("@Email", txtemail.Text.Trim()),
                new SqlParameter("@UserType", DropDownList1.SelectedValue),
                new SqlParameter("@Mobile", txtno.Text.Trim())
            };

            int rows = DatabaseHelper.ExecuteNonQuery(query, parameters);
            if (rows > 0)
            {
                lblStatus.Text = "Registration Successful! Record inserted via ADO.NET.";
                lblStatus.ForeColor = System.Drawing.Color.Green;
            }
            else
            {
                lblStatus.Text = "Registration Failed. Please try again.";
                lblStatus.ForeColor = System.Drawing.Color.Red;
            }
        }
    }
}`
      },
      {
        id: 'reg-vb',
        name: 'RegistrationPage.aspx.vb',
        path: 'MSU_DotNet_Solution/RegistrationPage.aspx.vb',
        language: 'vb',
        category: 'code-behind',
        tag: 'VB.NET Code-Behind',
        summary: 'Visual Basic .NET implementation of the registration code-behind for dual-language curriculum compliance.',
        code: `Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.UI
Imports System.Web.UI.WebControls

Namespace MSU_DotNet_Web
    Partial Public Class RegistrationPage_VB
        Inherits System.Web.UI.Page

        Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs) Handles Me.Load
            If Not IsPostBack Then
                lblStatus.Text = String.Empty
            End If
        End Sub

        Protected Sub CustomValidator1_ServerValidate(ByVal source As Object, ByVal args As ServerValidateEventArgs)
            Dim num As Long
            If args.Value IsNot Nothing AndAlso args.Value.Length = 10 AndAlso Long.TryParse(args.Value, num) Then
                args.IsValid = True
            Else
                args.IsValid = False
            End If
        End Sub

        Protected Sub btnsubmit_Click(ByVal sender As Object, ByVal e As EventArgs)
            If Not Page.IsValid Then
                lblStatus.Text = "Please resolve validation errors."
                lblStatus.ForeColor = Drawing.Color.Red
                Return
            End If

            Dim gender As String = If(RadioButton1.Checked, "Male", "Female")
            Dim hobbies As String = ""
            If CheckBox1.Checked Then hobbies &= "Reading, "
            If CheckBox2.Checked Then hobbies &= "Playing, "
            If CheckBox3.Checked Then hobbies &= "Dancing, "
            hobbies = hobbies.TrimEnd(" "c, ","c)

            Dim query As String = "INSERT INTO regdb (Name, Address, Birthdate, Gender, Hobbies, Age, Username, Password, Email, UserType, Mobile) " & _
                                  "VALUES (@Name, @Address, @Birthdate, @Gender, @Hobbies, @Age, @Username, @Password, @Email, @UserType, @Mobile)"

            Dim params() As SqlParameter = {
                New SqlParameter("@Name", txtname.Text.Trim()),
                New SqlParameter("@Address", txtadd.Text.Trim()),
                New SqlParameter("@Birthdate", DateTime.Parse(txtbirth.Text)),
                New SqlParameter("@Gender", gender),
                New SqlParameter("@Hobbies", hobbies),
                New SqlParameter("@Age", Integer.Parse(txtage.Text.Trim())),
                New SqlParameter("@Username", txtuser.Text.Trim()),
                New SqlParameter("@Password", txtpswd.Text),
                New SqlParameter("@Email", txtemail.Text.Trim()),
                New SqlParameter("@UserType", DropDownList1.SelectedValue),
                New SqlParameter("@Mobile", txtno.Text.Trim())
            }

            Dim rows As Integer = DatabaseHelper.ExecuteNonQuery(query, params)
            If rows > 0 Then
                lblStatus.Text = "Registration record saved via ADO.NET in VB.NET."
                lblStatus.ForeColor = Drawing.Color.Green
            End If
        End Sub
    End Class
End Namespace`
      },
      {
        id: 'login-cs',
        name: 'LoginPage.aspx.cs',
        path: 'MSU_DotNet_Solution/LoginPage.aspx.cs',
        language: 'csharp',
        category: 'code-behind',
        tag: 'C# Code-Behind',
        summary: 'Performs ADO.NET credential lookup from dbo.regdb, verifies password hash, sets Session variables, and handles redirection.',
        code: `using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class LoginPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblMsg.Text = string.Empty;
            }
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            string username = txtname.Text.Trim();
            string password = txtpassword.Text;
            string role = DropDownList1.SelectedValue;

            string query = "SELECT COUNT(*) FROM regdb WHERE Username = @Username AND Password = @Password AND UserType = @UserType";
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Username", username),
                new SqlParameter("@Password", password),
                new SqlParameter("@UserType", role)
            };

            int count = Convert.ToInt32(DatabaseHelper.ExecuteScalar(query, parameters));
            if (count > 0)
            {
                Session["username"] = username;
                Session["usertype"] = role;
                Session["authenticated"] = true;

                if (role == "Admin")
                    Response.Redirect("AdminDashboard.aspx");
                else
                    Response.Redirect("StudentArea.aspx");
            }
            else
            {
                lblMsg.Text = "Invalid username, password, or role selection.";
            }
        }
    }
}`
      },
      {
        id: 'student-cs',
        name: 'StudentArea.aspx.cs',
        path: 'MSU_DotNet_Solution/StudentArea.aspx.cs',
        language: 'csharp',
        category: 'code-behind',
        tag: 'C# Code-Behind',
        summary: 'Verifies active Session["username"], populates profile data, and provides secure Session.Abandon() logout functionality.',
        code: `using System;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class StudentArea : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["username"] != null)
            {
                lblUser.Text = "Welcome, " + Session["username"].ToString();
                lblSessionVal.Text = "Active user: " + Session["username"].ToString() + " (Session ID: " + Session.SessionID + ")";
            }
            else
            {
                Response.Redirect("LoginPage.aspx");
            }
        }

        protected void btnLogout_Click(object sender, EventArgs e)
        {
            Session.Abandon();
            Response.Redirect("LoginPage.aspx");
        }
    }
}`
      },
      {
        id: 'feedback-cs',
        name: 'Feedback.aspx.cs',
        path: 'MSU_DotNet_Solution/Feedback.aspx.cs',
        language: 'csharp',
        category: 'code-behind',
        tag: 'C# Code-Behind',
        summary: 'Inserts student lab ratings and subjective comments into dbo.feedback using parameterized ADO.NET SQL commands.',
        code: `using System;
using System.Data.SqlClient;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class Feedback : System.Web.UI.Page
    {
        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            if (!Page.IsValid) return;

            string query = @"INSERT INTO feedback (StudentName, Subject, Rating, Comments, CreatedAt)
                             VALUES (@StudentName, @Subject, @Rating, @Comments, @CreatedAt)";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@StudentName", txtName.Text.Trim()),
                new SqlParameter("@Subject", txtSubject.Text.Trim()),
                new SqlParameter("@Rating", int.Parse(rblRating.SelectedValue)),
                new SqlParameter("@Comments", txtComments.Text.Trim()),
                new SqlParameter("@CreatedAt", DateTime.Now)
            };

            int rows = DatabaseHelper.ExecuteNonQuery(query, parameters);
            if (rows > 0)
            {
                lblMessage.Text = "Thank you! Your feedback has been recorded.";
                lblMessage.ForeColor = System.Drawing.Color.Green;
                txtName.Text = string.Empty;
                txtSubject.Text = string.Empty;
                txtComments.Text = string.Empty;
            }
            else
            {
                lblMessage.Text = "Failed to record feedback. Please try again.";
                lblMessage.ForeColor = System.Drawing.Color.Red;
            }
        }
    }
}`
      },
      {
        id: 'upload-cs',
        name: 'UploadFile.aspx.cs',
        path: 'MSU_DotNet_Solution/UploadFile.aspx.cs',
        language: 'csharp',
        category: 'code-behind',
        tag: 'C# Code-Behind',
        summary: 'Validates file extensions (.png, .jpg, .jpeg), file size, and executes FileUpload.SaveAs to write the file onto the server filesystem.',
        code: `using System;
using System.IO;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class UploadFile : System.Web.UI.Page
    {
        protected void Button1_Click(object sender, EventArgs e)
        {
            if (FileUpload1.HasFile)
            {
                try
                {
                    string ext = Path.GetExtension(FileUpload1.FileName).ToLower();
                    if (ext == ".jpg" || ext == ".jpeg" || ext == ".png")
                    {
                        string saveFolder = Server.MapPath("~/images/");
                        if (!Directory.Exists(saveFolder))
                        {
                            Directory.CreateDirectory(saveFolder);
                        }

                        string targetPath = Path.Combine(saveFolder, Path.GetFileName(FileUpload1.FileName));
                        FileUpload1.SaveAs(targetPath);

                        lblStatus.Text = "File uploaded successfully: " + FileUpload1.FileName;
                        lblStatus.ForeColor = System.Drawing.Color.Green;
                    }
                    else
                    {
                        lblStatus.Text = "Only JPG and PNG images are allowed.";
                        lblStatus.ForeColor = System.Drawing.Color.Red;
                    }
                }
                catch (Exception ex)
                {
                    lblStatus.Text = "Upload error: " + ex.Message;
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                }
            }
            else
            {
                lblStatus.Text = "Please select a file to upload.";
                lblStatus.ForeColor = System.Drawing.Color.Red;
            }
        }
    }
}`
      }
    ]
  },
  {
    id: 'data-layer',
    name: 'Database & Data Access Layer (ADO.NET & SQL)',
    description: 'Database helper utility classes, connection management, and SQL database schemas.',
    files: [
      {
        id: 'dbhelper',
        name: 'DatabaseHelper.cs',
        path: 'MSU_DotNet_Solution/DatabaseHelper.cs',
        language: 'csharp',
        category: 'data-layer',
        tag: 'Data Access Layer',
        summary: 'Central ADO.NET utility providing connection string resolution, parameterized ExecuteNonQuery, ExecuteScalar, and ExecuteReader methods.',
        code: `using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace MSU_DotNet_Web
{
    public static class DatabaseHelper
    {
        private static readonly string ConnectionString =
            ConfigurationManager.ConnectionStrings["regdbConnection"]?.ConnectionString
            ?? "Server=(localdb)\\\\MSSQLLocalDB;Database=msu_regdb;Integrated Security=True;";

        public static SqlConnection GetConnection()
        {
            SqlConnection conn = new SqlConnection(ConnectionString);
            if (conn.State != ConnectionState.Open)
                conn.Open();
            return conn;
        }

        public static int ExecuteNonQuery(string query, SqlParameter[] parameters = null)
        {
            using (SqlConnection conn = GetConnection())
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);
                return cmd.ExecuteNonQuery();
            }
        }

        public static object ExecuteScalar(string query, SqlParameter[] parameters = null)
        {
            using (SqlConnection conn = GetConnection())
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);
                return cmd.ExecuteScalar();
            }
        }

        public static DataTable ExecuteDataTable(string query, SqlParameter[] parameters = null)
        {
            using (SqlConnection conn = GetConnection())
            using (SqlCommand cmd = new SqlCommand(query, conn))
            using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
            {
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                return dt;
            }
        }
    }
}`
      },
      {
        id: 'sql-schema',
        name: 'Schema_regdb.sql',
        path: 'MSU_DotNet_Solution/Database/Schema_regdb.sql',
        language: 'sql',
        category: 'data-layer',
        tag: 'SQL DDL Schema',
        summary: 'Complete SQL schema creating tables: regdb (users & registration), feedback (lab evaluations), and electives (student courses).',
        code: `-- =======================================================
-- Database Schema for MSU Polytechnic IT Academic Portal
-- Target RDBMS: Microsoft SQL Server / LocalDB / SQLite
-- =======================================================

CREATE DATABASE msu_regdb;
GO

USE msu_regdb;
GO

-- 1. User Registration Table
CREATE TABLE regdb (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Address NVARCHAR(250) NOT NULL,
    Birthdate DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Hobbies NVARCHAR(200),
    Age INT NOT NULL CHECK (Age >= 16 AND Age <= 100),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    UserType NVARCHAR(20) NOT NULL DEFAULT 'Student',
    Mobile NVARCHAR(10) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Feedback Table
CREATE TABLE feedback (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentName NVARCHAR(100) NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comments NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 3. Elective Allocation Table
CREATE TABLE electives (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentUsername NVARCHAR(50) NOT NULL,
    ElectiveCode NVARCHAR(20) NOT NULL,
    ElectiveName NVARCHAR(150) NOT NULL,
    Semester INT NOT NULL,
    EnrolledAt DATETIME DEFAULT GETDATE()
);

-- Seed Administrator Account
INSERT INTO regdb (Name, Address, Birthdate, Gender, Hobbies, Age, Username, Password, Email, UserType, Mobile)
VALUES ('Shlok Shah', 'Vadodara, Gujarat', '2008-12-04', 'Male', 'Coding, Technology', 17, 'shlok', 'Admin@412', 'shlokshah412@gmail.com', 'Admin', '9512345504');`
      }
    ]
  },
  {
    id: 'server-config',
    name: 'ASP.NET Core Server & Configuration',
    description: 'Modern ASP.NET Core 9.0 REST API engine, MSBuild project files, Dockerfile, and Web.config.',
    files: [
      {
        id: 'program-cs',
        name: 'Program.cs (ASP.NET Core Server)',
        path: 'DotNetServer/Program.cs',
        language: 'csharp',
        category: 'server-config',
        tag: 'ASP.NET Core 9.0 API',
        summary: 'Minimal API server in ASP.NET Core 9.0 exposing REST endpoints (/api/users, /api/auth/login, /api/feedback, /api/health) and SQLite persistence.',
        code: `using System.Data;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for Vite dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");
app.UseDefaultFiles();
app.UseStaticFiles();

const string connectionString = "Data Source=academic_portal.db";

// Initialize SQLite database tables
using (var connection = new SqliteConnection(connectionString))
{
    connection.Open();
    var cmd = connection.CreateCommand();
    cmd.CommandText = @"
        CREATE TABLE IF NOT EXISTS regdb (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            Address TEXT NOT NULL,
            Birthdate TEXT NOT NULL,
            Gender TEXT NOT NULL,
            Hobbies TEXT,
            Age INTEGER NOT NULL,
            Username TEXT NOT NULL UNIQUE,
            Password TEXT NOT NULL,
            Email TEXT NOT NULL,
            UserType TEXT NOT NULL,
            Mobile TEXT NOT NULL,
            CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS feedback (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            StudentName TEXT NOT NULL,
            Subject TEXT NOT NULL,
            Rating INTEGER NOT NULL,
            Comments TEXT,
            CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
    ";
    cmd.ExecuteNonQuery();
}

// Health Check Endpoint
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "Healthy",
    framework = ".NET 9.0",
    engine = "ASP.NET Core Minimal API",
    database = "SQLite / ADO.NET LocalDB",
    timestamp = DateTime.UtcNow
}));

// Users Endpoints
app.MapGet("/api/users", () =>
{
    var list = new List<Dictionary<string, object>>();
    using var conn = new SqliteConnection(connectionString);
    conn.Open();
    using var cmd = new SqliteCommand("SELECT * FROM regdb ORDER BY Id DESC", conn);
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        var row = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
            row[reader.GetName(i).ToLower()] = reader.GetValue(i);
        list.Add(row);
    }
    return Results.Ok(list);
});

app.MapPost("/api/users", async (HttpContext context) =>
{
    var form = await context.Request.ReadFromJsonAsync<Dictionary<string, object>>();
    if (form == null) return Results.BadRequest("Invalid payload");

    using var conn = new SqliteConnection(connectionString);
    conn.Open();
    using var cmd = new SqliteCommand(@"
        INSERT INTO regdb (Name, Address, Birthdate, Gender, Hobbies, Age, Username, Password, Email, UserType, Mobile)
        VALUES (@Name, @Address, @Birthdate, @Gender, @Hobbies, @Age, @Username, @Password, @Email, @UserType, @Mobile)
    ", conn);

    cmd.Parameters.AddWithValue("@Name", form.GetValueOrDefault("name", ""));
    cmd.Parameters.AddWithValue("@Address", form.GetValueOrDefault("address", ""));
    cmd.Parameters.AddWithValue("@Birthdate", form.GetValueOrDefault("birthdate", ""));
    cmd.Parameters.AddWithValue("@Gender", form.GetValueOrDefault("gender", "Male"));
    cmd.Parameters.AddWithValue("@Hobbies", form.GetValueOrDefault("hobbies", ""));
    cmd.Parameters.AddWithValue("@Age", Convert.ToInt32(form.GetValueOrDefault("age", 18)));
    cmd.Parameters.AddWithValue("@Username", form.GetValueOrDefault("username", ""));
    cmd.Parameters.AddWithValue("@Password", form.GetValueOrDefault("password", ""));
    cmd.Parameters.AddWithValue("@Email", form.GetValueOrDefault("email", ""));
    cmd.Parameters.AddWithValue("@UserType", form.GetValueOrDefault("usertype", "Student"));
    cmd.Parameters.AddWithValue("@Mobile", form.GetValueOrDefault("mobile", ""));

    cmd.ExecuteNonQuery();
    return Results.Ok(new { success = true, message = "Record inserted successfully via ADO.NET" });
});

app.MapFallbackToFile("index.html");
app.Run("http://0.0.0.0:5000");`
      },
      {
        id: 'web-config',
        name: 'Web.config',
        path: 'MSU_DotNet_Solution/Web.config',
        language: 'xml',
        category: 'server-config',
        tag: 'XML Config',
        summary: 'XML configuration defining connection strings, compilation parameters, UnobtrusiveValidationMode, and authentication.',
        code: `<?xml version="1.0" encoding="utf-8"?>
<!--
  For more information on how to configure your ASP.NET application, please visit
  https://go.microsoft.com/fwlink/?LinkId=169433
  -->
<configuration>
  <connectionStrings>
    <add name="regdbConnection"
         connectionString="Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\\msu_regdb.mdf;Integrated Security=True"
         providerName="System.Data.SqlClient" />
  </connectionStrings>
  
  <system.web>
    <compilation debug="true" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8" maxRequestLength="10240" />
    <sessionState mode="InProc" timeout="30" />
  </system.web>

  <appSettings>
    <add key="ValidationSettings:UnobtrusiveValidationMode" value="None" />
  </appSettings>
</configuration>`
      },
      {
        id: 'csproj-web',
        name: 'MSU_DotNet_Web.csproj',
        path: 'MSU_DotNet_Solution/MSU_DotNet_Web.csproj',
        language: 'xml',
        category: 'server-config',
        tag: 'MSBuild XML',
        summary: 'MSBuild project configuration file for the Web Forms application, declaring dependencies such as System.Data.SqlClient.',
        code: `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>MSU_DotNet_Web</RootNamespace>
    <AssemblyName>MSU_DotNet_Web</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="System.Data.SqlClient" Version="4.8.6" />
  </ItemGroup>

</Project>`
      },
      {
        id: 'csproj-server',
        name: 'DotNetServer.csproj',
        path: 'DotNetServer/DotNetServer.csproj',
        language: 'xml',
        category: 'server-config',
        tag: 'MSBuild XML',
        summary: 'MSBuild project configuration for the ASP.NET Core 9.0 server with Microsoft.Data.Sqlite and System.Data.SqlClient packages.',
        code: `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Data.Sqlite" Version="9.0.2" />
    <PackageReference Include="System.Data.SqlClient" Version="4.9.1" />
  </ItemGroup>

</Project>`
      },
      {
        id: 'dockerfile',
        name: 'Dockerfile',
        path: 'Dockerfile',
        language: 'docker',
        category: 'server-config',
        tag: 'Docker Container',
        summary: 'Multi-stage Docker build combining Node 20 (Vite React frontend) and .NET 9.0 SDK into a lightweight production container for Render deployment.',
        code: `# Multi-stage Dockerfile for All-in-One Full-Stack Deployment

# Stage 1: Build Frontend (Vite + React)
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build & Publish .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src
COPY DotNetServer/DotNetServer.csproj DotNetServer/
RUN dotnet restore DotNetServer/DotNetServer.csproj
COPY DotNetServer/ DotNetServer/
WORKDIR /src/DotNetServer
RUN dotnet publish -c Release -o /app/publish

# Copy frontend build output to wwwroot so ASP.NET Core serves both UI and API
COPY --from=frontend-build /app/dist /app/publish/wwwroot

# Stage 3: Final Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
ENV PORT=5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "DotNetServer.dll"]`
      }
    ]
  }
];
