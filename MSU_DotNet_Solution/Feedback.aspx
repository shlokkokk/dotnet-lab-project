<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Feedback.aspx.cs" Inherits="MSU_DotNet_Web.Feedback" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Feedback &amp; GridView | MSU Polytechnic</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 850px; margin: 20px auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h3 { color: #0f2b48; margin-top: 0; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
        .form-row { margin-bottom: 12px; }
        .form-row label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 4px; }
        .form-control { width: 100%; padding: 8px 10px; border: 1px solid #cccccc; border-radius: 4px; box-sizing: border-box; }
        .btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; }
        .grid-view { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .grid-view th { background: #0f2b48; color: white; padding: 10px; text-align: left; font-size: 13px; }
        .grid-view td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .grid-view tr:nth-child(even) { background-color: #f8fafc; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <h3>Laboratory Feedback &amp; ADO.NET GridView (Exp 14)</h3>

            <div class="form-row">
                <label>Email (TextBox3):</label>
                <asp:TextBox ID="TextBox3" runat="server" CssClass="form-control" placeholder="pealpashmi@gmail.com"></asp:TextBox>
            </div>

            <div class="form-row">
                <label>Feedback Message (TextBox4):</label>
                <asp:TextBox ID="TextBox4" runat="server" TextMode="MultiLine" Rows="3" CssClass="form-control" placeholder="Enter comments here..."></asp:TextBox>
            </div>

            <div style="margin-top: 15px;">
                <asp:Button ID="Button1" runat="server" Text="Insert Feedback" OnClick="Button1_Click" CssClass="btn" />
                <asp:LinkButton ID="LinkButton1" runat="server" Text="Refresh GridView" OnClick="LinkButton1_Click" style="margin-left: 15px; font-size: 13px;"></asp:LinkButton>
            </div>

            <h4 style="margin-top: 30px; margin-bottom: 10px; color: #333333;">Bound Data via SqlDataAdapter &amp; DataSet:</h4>

            <asp:GridView ID="GridView1" runat="server" CssClass="grid-view" AutoGenerateColumns="true" EmptyDataText="No feedback records found in dbo.fd_table.">
            </asp:GridView>
        </div>
    </form>
</body>
</html>
