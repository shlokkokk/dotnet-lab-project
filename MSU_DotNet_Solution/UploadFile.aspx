<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UploadFile.aspx.cs" Inherits="MSU_DotNet_Web.UploadFile" %>

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
            <p style="font-size: 13px; color: #64748b;">Select an image file to upload to the server's \images\ folder.</p>

            <asp:FileUpload ID="FileUpload1" runat="server" style="margin-bottom: 15px; display: block;" />
            
            <asp:Button ID="Button1" runat="server" Text="Upload Photo" OnClick="Button1_Click" CssClass="btn" />

            <asp:Label ID="lblStatus" runat="server" style="display: block; margin-top: 15px; font-weight: 600; font-size: 14px;"></asp:Label>
        </div>
    </form>
</body>
</html>
