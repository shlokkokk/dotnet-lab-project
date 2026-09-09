<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LoginPage.aspx.cs" Inherits="MSU_DotNet_Web.LoginPage" %>

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
</html>
