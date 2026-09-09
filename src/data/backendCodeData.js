export const backendCategories = [
  {
    id: 'webforms',
    name: 'ASP.NET Web Forms (.aspx & Code-Behind)',
    description: 'Native Visual Studio Web Forms implementing Experiments 14 & 15 with ASP.NET validation controls, event handlers, and ADO.NET commands.',
    files: [
      {
        id: 'reg-aspx',
        name: 'RegistrationPage.aspx',
        path: 'MSU_DotNet_Solution/RegistrationPage.aspx',
        language: 'html',
        category: 'webforms',
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
        id: 'reg-cs',
        name: 'RegistrationPage.aspx.cs',
        path: 'MSU_DotNet_Solution/RegistrationPage.aspx.cs',
        language: 'csharp',
        category: 'webforms',
        tag: 'C# Code-Behind',
        summary: 'Handles ServerValidate for mobile numbers, resets control states, builds parameterized SQL INSERT queries, and calls DatabaseHelper.ExecuteNonQuery to insert into dbo.regdb.',
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
            DropDownList1.SelectedIndex = 0;
            lblStatus.Text = string.Empty;
        }

        protected void btnsubmit_Click(object sender, EventArgs e)
        {
            if (Page.IsValid)
            {
                string gender = RadioButton1.Checked ? "Male" : "Female";
                
                string hobbies = string.Empty;
                if (CheckBox1.Checked) hobbies += CheckBox1.Text;
                if (CheckBox2.Checked) hobbies += (string.IsNullOrEmpty(hobbies) ? "" : ", ") + CheckBox2.Text;
                if (CheckBox3.Checked) hobbies += (string.IsNullOrEmpty(hobbies) ? "" : ", ") + CheckBox3.Text;

                string query = @"INSERT INTO dbo.regdb 
                    (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile) 
                    VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno)";

                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@nm", SqlDbType.VarChar, 50) { Value = txtname.Text.Trim() },
                    new SqlParameter("@add", SqlDbType.VarChar, 255) { Value = txtadd.Text.Trim() },
                    new SqlParameter("@bdt", SqlDbType.VarChar, 50) { Value = txtbirth.Text.Trim() },
                    new SqlParameter("@gen", SqlDbType.VarChar, 50) { Value = gender },
                    new SqlParameter("@hob", SqlDbType.VarChar, 100) { Value = hobbies },
                    new SqlParameter("@age", SqlDbType.VarChar, 10) { Value = txtage.Text.Trim() },
                    new SqlParameter("@unm", SqlDbType.VarChar, 50) { Value = txtuser.Text.Trim() },
                    new SqlParameter("@pwd", SqlDbType.VarChar, 50) { Value = txtpswd.Text.Trim() },
                    new SqlParameter("@cpwd", SqlDbType.VarChar, 50) { Value = txtconfirm.Text.Trim() },
                    new SqlParameter("@email", SqlDbType.VarChar, 100) { Value = txtemail.Text.Trim() },
                    new SqlParameter("@ut", SqlDbType.VarChar, 50) { Value = DropDownList1.SelectedValue },
                    new SqlParameter("@mno", SqlDbType.Decimal) { Value = Convert.ToDecimal(txtno.Text.Trim()) }
                };

                try
                {
                    int rows = DatabaseHelper.ExecuteNonQuery(query, parameters);
                    if (rows > 0)
                    {
                        lblStatus.ForeColor = System.Drawing.Color.Green;
                        lblStatus.Text = "Registration Successful! Redirecting to login...";
                        Response.Redirect("LoginPage.aspx");
                    }
                }
                catch (Exception ex)
                {
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblStatus.Text = "Database Error: " + ex.Message;
                }
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
        category: 'webforms',
        tag: 'VB.NET Code-Behind',
        summary: 'Visual Basic .NET implementation matching the exact syntax patterns from the MSU .NET laboratory syllabus.',
        code: `Imports System.Data
Imports System.Data.SqlClient

Partial Class RegistrationPage
    Inherits System.Web.UI.Page

    Protected Sub CustomValidator1_ServerValidate(source As Object, args As ServerValidateEventArgs) Handles CustomValidator1.ServerValidate
        If args.Value IsNot Nothing AndAlso args.Value.Length = 10 AndAlso IsNumeric(args.Value) Then
            args.IsValid = True
        Else
            args.IsValid = False
        End If
    End Sub

    Protected Sub btnreset_Click(sender As Object, e As EventArgs) Handles btnreset.Click
        txtname.Text = ""
        txtadd.Text = ""
        txtbirth.Text = ""
        txtage.Text = ""
        txtuser.Text = ""
        txtpswd.Text = ""
        txtconfirm.Text = ""
        txtemail.Text = ""
        txtno.Text = ""
        RadioButton1.Checked = True
        RadioButton2.Checked = False
        CheckBox1.Checked = False
        CheckBox2.Checked = False
        CheckBox3.Checked = False
        DropDownList1.SelectedIndex = 0
        lblStatus.Text = ""
    End Sub

    Protected Sub btnsubmit_Click(sender As Object, e As EventArgs) Handles btnsubmit.Click
        If Page.IsValid Then
            Dim gender As String = If(RadioButton1.Checked, "Male", "Female")
            Dim hobbies As String = ""
            If CheckBox1.Checked Then hobbies &= CheckBox1.Text
            If CheckBox2.Checked Then hobbies &= If(String.IsNullOrEmpty(hobbies), "", ", ") & CheckBox2.Text
            If CheckBox3.Checked Then hobbies &= If(String.IsNullOrEmpty(hobbies), "", ", ") & CheckBox3.Text

            Dim query As String = "INSERT INTO dbo.regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile) " & _
                                  "VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno)"

            Dim conStr As String = ConfigurationManager.ConnectionStrings("con").ConnectionString
            Using con As New SqlConnection(conStr)
                Using cmd As New SqlCommand(query, con)
                    cmd.Parameters.AddWithValue("@nm", txtname.Text.Trim())
                    cmd.Parameters.AddWithValue("@add", txtadd.Text.Trim())
                    cmd.Parameters.AddWithValue("@bdt", txtbirth.Text.Trim())
                    cmd.Parameters.AddWithValue("@gen", gender)
                    cmd.Parameters.AddWithValue("@hob", hobbies)
                    cmd.Parameters.AddWithValue("@age", txtage.Text.Trim())
                    cmd.Parameters.AddWithValue("@unm", txtuser.Text.Trim())
                    cmd.Parameters.AddWithValue("@pwd", txtpswd.Text.Trim())
                    cmd.Parameters.AddWithValue("@cpwd", txtconfirm.Text.Trim())
                    cmd.Parameters.AddWithValue("@email", txtemail.Text.Trim())
                    cmd.Parameters.AddWithValue("@ut", DropDownList1.SelectedValue)
                    cmd.Parameters.AddWithValue("@mno", Convert.ToDecimal(txtno.Text.Trim()))

                    con.Open()
                    cmd.ExecuteNonQuery()
                    lblStatus.ForeColor = Drawing.Color.Green
                    lblStatus.Text = "Registration Successful!"
                    Response.Redirect("LoginPage.aspx")
                End Using
            End Using
        End If
    End Sub
End Class`
      },
      {
        id: 'feedback-aspx',
        name: 'Feedback.aspx',
        path: 'MSU_DotNet_Solution/Feedback.aspx',
        language: 'html',
        category: 'webforms',
        tag: 'Experiment 14 GridView Markup',
        summary: 'Web Forms markup hosting TextBox3 (Email), TextBox4 (Feedback), Button1, and GridView1 for disconnected ADO.NET data binding.',
        code: `<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Feedback.aspx.cs" Inherits="MSU_DotNet_Web.Feedback" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Feedback & DataBinding - MSU Polytechnic (.NET Lab Exp 14)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .feedback-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .grid-style { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .grid-style th { background-color: #1e3a8a; color: #fff; padding: 10px; text-align: left; }
        .grid-style td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
        .form-row { margin-bottom: 15px; }
        .form-label { display: block; font-weight: 600; margin-bottom: 5px; color: #334155; }
        .form-input { width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
        .btn-submit { background-color: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 4px; font-weight: 600; cursor: pointer; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div class="feedback-container">
        <h2 style="color: #0f172a; margin-top: 0;">Laboratory Feedback & Live GridView (Exp 14)</h2>
        
        <div class="form-row">
            <span class="form-label">Student Email (TextBox3):</span>
            <asp:TextBox ID="TextBox3" runat="server" CssClass="form-input" placeholder="name@example.com"></asp:TextBox>
        </div>

        <div class="form-row">
            <span class="form-label">Feedback Review (TextBox4):</span>
            <asp:TextBox ID="TextBox4" runat="server" TextMode="MultiLine" Rows="3" CssClass="form-input" placeholder="Course remarks..."></asp:TextBox>
        </div>

        <div>
            <asp:Button ID="Button1" runat="server" Text="Submit Feedback (Button1_Click)" OnClick="Button1_Click" CssClass="btn-submit" />
            &nbsp;
            <asp:LinkButton ID="LinkButton1" runat="server" OnClick="LinkButton1_Click" ForeColor="#0284c7">Refresh GridView</asp:LinkButton>
        </div>

        <h3 style="margin-top: 30px; color: #334155;">GridView1 (Bound to dbo.fd_table via DataSet)</h3>
        <asp:GridView ID="GridView1" runat="server" CssClass="grid-style" AutoGenerateColumns="true" EmptyDataText="No feedback records found.">
        </asp:GridView>
    </div>
    </form>
</body>
</html>`
      },
      {
        id: 'feedback-cs',
        name: 'Feedback.aspx.cs',
        path: 'MSU_DotNet_Solution/Feedback.aspx.cs',
        language: 'csharp',
        category: 'webforms',
        tag: 'Experiment 14 C# Code-Behind',
        summary: 'Implements disconnected data binding using SqlDataAdapter.Fill(DataSet, "F") and GridView1.DataBind().',
        code: `using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class Feedback : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BindGridView();
            }
        }

        private void BindGridView()
        {
            string query = "SELECT name, feedback FROM dbo.fd_table ORDER BY id DESC";
            try
            {
                DataSet ds = DatabaseHelper.ExecuteDataSet(query, "F");
                GridView1.DataSource = ds.Tables["F"];
                GridView1.DataBind();
            }
            catch (Exception ex)
            {
                Response.Write("DataBinding Error: " + ex.Message);
            }
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            string query = "INSERT INTO dbo.fd_table (name, feedback) VALUES (@e, @f)";
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@e", SqlDbType.VarChar, 50) { Value = TextBox3.Text.Trim() },
                new SqlParameter("@f", SqlDbType.VarChar) { Value = TextBox4.Text.Trim() }
            };

            try
            {
                DatabaseHelper.ExecuteNonQuery(query, parameters);
                TextBox4.Text = string.Empty;
                BindGridView();
            }
            catch (Exception ex)
            {
                Response.Write("Insert Error: " + ex.Message);
            }
        }

        protected void LinkButton1_Click(object sender, EventArgs e)
        {
            BindGridView();
        }
    }
}`
      },
      {
        id: 'login-cs',
        name: 'LoginPage.aspx.cs',
        path: 'MSU_DotNet_Solution/LoginPage.aspx.cs',
        language: 'csharp',
        category: 'webforms',
        tag: 'Authentication C#',
        summary: 'Validates credentials using SqlCommand.ExecuteScalar() and provisions user Session variables.',
        code: `using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Security;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class LoginPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblMessage.Text = string.Empty;
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            string usernameOrEmail = txtUsername.Text.Trim();
            string password = txtPassword.Text;
            string role = ddlRole.SelectedValue;

            string query = @"SELECT COUNT(*) FROM dbo.regdb 
                             WHERE (username = @u OR email = @u) 
                             AND password = @p 
                             AND usertype = @r";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@u", SqlDbType.VarChar, 100) { Value = usernameOrEmail },
                new SqlParameter("@p", SqlDbType.VarChar, 50) { Value = password },
                new SqlParameter("@r", SqlDbType.VarChar, 50) { Value = role }
            };

            try
            {
                object result = DatabaseHelper.ExecuteScalar(query, parameters);
                int count = Convert.ToInt32(result);

                if (count > 0)
                {
                    Session["User"] = usernameOrEmail;
                    Session["Role"] = role;

                    FormsAuthentication.SetAuthCookie(usernameOrEmail, false);

                    if (role == "Student")
                    {
                        Response.Redirect("StudentArea.aspx");
                    }
                    else
                    {
                        Response.Redirect("AdminDashboard.aspx");
                    }
                }
                else
                {
                    lblMessage.ForeColor = System.Drawing.Color.Red;
                    lblMessage.Text = "Invalid username/password or incorrect role.";
                }
            }
            catch (Exception ex)
            {
                lblMessage.ForeColor = System.Drawing.Color.Red;
                lblMessage.Text = "Authentication Error: " + ex.Message;
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
        category: 'webforms',
        tag: 'File Upload Control',
        summary: 'Handles server-side file uploads using FileUpload1.SaveAs and validates file extensions against the web server.',
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
                string extension = Path.GetExtension(FileUpload1.FileName).ToLower();
                if (extension == ".jpg" || extension == ".png" || extension == ".jpeg")
                {
                    if (FileUpload1.PostedFile.ContentLength < 2 * 1024 * 1024)
                    {
                        try
                        {
                            string filename = Path.GetFileName(FileUpload1.FileName);
                            string spath = Server.MapPath("~/images/") + filename;
                            
                            if (!Directory.Exists(Server.MapPath("~/images/")))
                            {
                                Directory.CreateDirectory(Server.MapPath("~/images/"));
                            }
                            
                            FileUpload1.SaveAs(spath);
                            Label1.ForeColor = System.Drawing.Color.Green;
                            Label1.Text = "File uploaded successfully: " + filename;
                            Image1.ImageUrl = "~/images/" + filename;
                        }
                        catch (Exception ex)
                        {
                            Label1.ForeColor = System.Drawing.Color.Red;
                            Label1.Text = "Upload error: " + ex.Message;
                        }
                    }
                    else
                    {
                        Label1.Text = "File size must be under 2MB.";
                    }
                }
                else
                {
                    Label1.Text = "Only .jpg, .png, and .jpeg files are accepted.";
                }
            }
        }
    }
}`
      }
    ]
  },
  {
    id: 'dal',
    name: 'Data Access Layer & Web Configuration',
    description: 'Centralized ADO.NET helper classes, parameterized command utilities, and XML application configuration.',
    files: [
      {
        id: 'dbhelper',
        name: 'DatabaseHelper.cs',
        path: 'MSU_DotNet_Solution/DatabaseHelper.cs',
        language: 'csharp',
        category: 'dal',
        tag: 'ADO.NET DAL Helper',
        summary: 'Contains clean reusable methods for ExecuteNonQuery, ExecuteScalar, ExecuteDataSet, and ExecuteDataTable using System.Data.SqlClient.',
        code: `using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace MSU_DotNet_Web
{
    public class DatabaseHelper
    {
        private static string connectionString = ConfigurationManager.ConnectionStrings["con"].ConnectionString;

        public static SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }

        public static int ExecuteNonQuery(string query, SqlParameter[] parameters)
        {
            using (SqlConnection con = GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    if (parameters != null)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }
                    con.Open();
                    return cmd.ExecuteNonQuery();
                }
            }
        }

        public static object ExecuteScalar(string query, SqlParameter[] parameters)
        {
            using (SqlConnection con = GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    if (parameters != null)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }
                    con.Open();
                    return cmd.ExecuteScalar();
                }
            }
        }

        public static DataSet ExecuteDataSet(string query, string tableName = "Table")
        {
            using (SqlConnection con = GetConnection())
            {
                using (SqlDataAdapter da = new SqlDataAdapter(query, con))
                {
                    DataSet ds = new DataSet();
                    da.Fill(ds, tableName);
                    return ds;
                }
            }
        }

        public static DataTable ExecuteDataTable(string query, SqlParameter[] parameters = null)
        {
            using (SqlConnection con = GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    if (parameters != null)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);
                        return dt;
                    }
                }
            }
        }
    }
}`
      },
      {
        id: 'webconfig',
        name: 'Web.config',
        path: 'MSU_DotNet_Solution/Web.config',
        language: 'xml',
        category: 'dal',
        tag: 'ASP.NET Config',
        summary: 'Configures connection strings to MSSQLLocalDB, InProc session states, and Forms Authentication.',
        code: `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <connectionStrings>
    <add name="con" 
         connectionString="Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\\MSU_AcademicDB.mdf;Integrated Security=True;Connect Timeout=30" 
         providerName="System.Data.SqlClient" />
  </connectionStrings>

  <system.web>
    <compilation debug="true" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8" maxRequestLength="4096" />
    <sessionState mode="InProc" timeout="30" />
    <authentication mode="Forms">
      <forms loginUrl="LoginPage.aspx" defaultUrl="StudentArea.aspx" timeout="30" />
    </authentication>
  </system.web>

  <system.webServer>
    <defaultDocument>
      <files>
        <add value="IndexPage.aspx" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>`
      },
      {
        id: 'schema-sql',
        name: 'Schema_regdb.sql',
        path: 'MSU_DotNet_Solution/Database/Schema_regdb.sql',
        language: 'sql',
        category: 'dal',
        tag: 'SQL Server Schema DDL',
        summary: 'SQL Server Table creation script defining [dbo].[regdb], [dbo].[fd_table], constraints, and seed data.',
        code: `USE [master]
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'MSU_AcademicDB')
BEGIN
    CREATE DATABASE [MSU_AcademicDB]
END
GO

USE [MSU_AcademicDB]
GO

-- 1. Experiment 15: Student/Faculty Registration Table
IF OBJECT_ID(N'[dbo].[regdb]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[regdb] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [name] VARCHAR(50) NOT NULL,
        [address] VARCHAR(255) NOT NULL,
        [birthdate] VARCHAR(50) NOT NULL,
        [gender] VARCHAR(50) NOT NULL,
        [hobbies] VARCHAR(100) NOT NULL,
        [age] VARCHAR(10) NOT NULL,
        [username] VARCHAR(50) NOT NULL UNIQUE,
        [password] VARCHAR(50) NOT NULL,
        [confirmpassword] VARCHAR(50) NOT NULL,
        [email] VARCHAR(100) NOT NULL,
        [usertype] VARCHAR(50) NOT NULL,
        [mobile] DECIMAL(18, 0) NOT NULL
    );
END
GO

-- 2. Experiment 14: Feedback Table for DataBinding
IF OBJECT_ID(N'[dbo].[fd_table]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[fd_table] (
        [id] INT IDENTITY(1,1) PRIMARY KEY,
        [name] NVARCHAR(50) NOT NULL,
        [feedback] NVARCHAR(MAX) NOT NULL
    );
END
GO

-- Seed Admin Profile for Shlok Shah
INSERT INTO [dbo].[regdb] 
([name], [address], [birthdate], [gender], [hobbies], [age], [username], [password], [confirmpassword], [email], [usertype], [mobile])
VALUES 
('Shlok Shah', 'Vadodara, Gujarat', '2008-12-04', 'Male', 'Coding, Technology', '17', 'shlok', 'Admin@412', 'Admin@412', 'shlokshah412@gmail.com', 'Admin', 9512345504);
GO`
      }
    ]
  },
  {
    id: 'coreapi',
    name: 'ASP.NET Core Live REST API Server',
    description: 'ASP.NET Core backend server providing live HTTP endpoints and persistent SQLite database interaction.',
    files: [
      {
        id: 'program-cs',
        name: 'Program.cs (ASP.NET Core Server)',
        path: 'DotNetServer/Program.cs',
        language: 'csharp',
        category: 'coreapi',
        tag: 'ASP.NET Core 9.0 API Engine',
        summary: 'Hosts high-performance endpoints for /api/users, /api/users/register, /api/auth/login, /api/feedback, and /api/electives with full parameterization.',
        code: `using System.Data;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();

string dbPath = Path.Combine(app.Environment.ContentRootPath, "academic_portal.db");
string connectionString = $"Data Source={dbPath}";

// Initialize Database Tables
using (var con = new SqliteConnection(connectionString))
{
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = @"
        CREATE TABLE IF NOT EXISTS regdb (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            birthdate TEXT NOT NULL,
            gender TEXT NOT NULL,
            hobbies TEXT NOT NULL,
            age TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            confirmpassword TEXT NOT NULL,
            email TEXT NOT NULL,
            usertype TEXT NOT NULL,
            mobile TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS fd_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            feedback TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS student_electives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            elective_name TEXT NOT NULL,
            allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ";
    cmd.ExecuteNonQuery();

    // Reset regdb with Shlok Shah admin profile
    cmd.CommandText = "DELETE FROM regdb;";
    cmd.ExecuteNonQuery();

    cmd.CommandText = @"
        INSERT INTO regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile)
        VALUES 
        ('Shlok Shah', 'Vadodara, Gujarat', '2008-12-04', 'Male', 'Coding, Technology', '17', 'shlok', 'Admin@412', 'Admin@412', 'shlokshah412@gmail.com', 'Admin', '9512345504');
    ";
    cmd.ExecuteNonQuery();
}

// 1. Health Status
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "Active",
    framework = ".NET 10.0 (C# Server Engine)",
    provider = "ADO.NET Core Data Provider",
    database = "academic_portal.db",
    timestamp = DateTime.UtcNow
}));

// 2. Fetch All Registered Users
app.MapGet("/api/users", () =>
{
    var list = new List<Dictionary<string, object>>();
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "SELECT * FROM regdb ORDER BY id DESC;";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        var row = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
            row[reader.GetName(i)] = reader.GetValue(i);
        }
        list.Add(row);
    }
    return Results.Ok(list);
});

// 3. User Registration Endpoint
app.MapPost("/api/users/register", ([FromBody] RegisterRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
    {
        return Results.BadRequest(new { error = "Username and password are required." });
    }

    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = @"
        INSERT INTO regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile)
        VALUES (@name, @address, @birthdate, @gender, @hobbies, @age, @username, @password, @confirmpassword, @email, @usertype, @mobile);
    ";

    cmd.Parameters.AddWithValue("@name", req.Name ?? "");
    cmd.Parameters.AddWithValue("@address", req.Address ?? "");
    cmd.Parameters.AddWithValue("@birthdate", req.Birthdate ?? "");
    cmd.Parameters.AddWithValue("@gender", req.Gender ?? "Male");
    cmd.Parameters.AddWithValue("@hobbies", req.Hobbies ?? "");
    cmd.Parameters.AddWithValue("@age", req.Age ?? "");
    cmd.Parameters.AddWithValue("@username", req.Username.Trim());
    cmd.Parameters.AddWithValue("@password", req.Password);
    cmd.Parameters.AddWithValue("@confirmpassword", req.Confirmpassword ?? req.Password);
    cmd.Parameters.AddWithValue("@email", req.Email ?? "");
    cmd.Parameters.AddWithValue("@usertype", req.Usertype ?? "Student");
    cmd.Parameters.AddWithValue("@mobile", req.Mobile ?? "");

    try
    {
        cmd.ExecuteNonQuery();
        return Results.Ok(new { success = true, username = req.Username, message = "User registered successfully." });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

// 4. Authentication Endpoint
app.MapPost("/api/auth/login", ([FromBody] LoginRequest req) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = @"
        SELECT * FROM regdb 
        WHERE (LOWER(username) = LOWER(@user) OR LOWER(email) = LOWER(@user))
        AND password = @pass 
        AND usertype = @role;
    ";

    cmd.Parameters.AddWithValue("@user", req.Username.Trim());
    cmd.Parameters.AddWithValue("@pass", req.Password);
    cmd.Parameters.AddWithValue("@role", req.Usertype);

    using var reader = cmd.ExecuteReader();
    if (reader.Read())
    {
        var user = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
            user[reader.GetName(i)] = reader.GetValue(i);
        }
        return Results.Ok(new { success = true, user });
    }

    return Results.BadRequest(new { success = false, error = "Invalid credentials or unauthorized role." });
});

// 5. Submit Feedback Endpoint
app.MapPost("/api/feedback", ([FromBody] FeedbackRequest req) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "INSERT INTO fd_table (name, feedback, rating) VALUES (@name, @feedback, @rating);";
    cmd.Parameters.AddWithValue("@name", req.Name);
    cmd.Parameters.AddWithValue("@feedback", req.Feedback);
    cmd.Parameters.AddWithValue("@rating", req.Rating);
    cmd.ExecuteNonQuery();
    return Results.Ok(new { success = true });
});

app.Run("http://0.0.0.0:5000");

public record RegisterRequest(string Name, string Address, string Birthdate, string Gender, string Hobbies, string Age, string Username, string Password, string Confirmpassword, string Email, string Usertype, string Mobile);
public record LoginRequest(string Username, string Password, string Usertype);
public record FeedbackRequest(string Name, string Feedback, int Rating);`
      }
    ]
  }
];
