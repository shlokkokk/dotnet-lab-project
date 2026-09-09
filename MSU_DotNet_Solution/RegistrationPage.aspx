<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RegistrationPage.aspx.cs" Inherits="MSU_DotNet_Web.RegistrationPage" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Student Registration | MSU Polytechnic</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 30px auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h2 { color: #0f2b48; margin-top: 0; border-bottom: 2px solid #0284c7; padding-bottom: 10px; }
        .form-row { margin-bottom: 15px; }
        .form-row label { display: block; font-weight: 600; margin-bottom: 5px; color: #333333; font-size: 14px; }
        .form-control { width: 100%; padding: 8px 12px; border: 1px solid #cccccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; }
        .validator { color: #dc2626; font-size: 12px; margin-top: 3px; display: block; }
        .btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .btn-reset { background: #64748b; margin-left: 10px; }
        .btn:hover { opacity: 0.9; }
        .val-summary { background: #fee2e2; border: 1px solid #f87171; color: #991b1b; padding: 12px; border-radius: 4px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <h2>Student &amp; Faculty Registration Form</h2>

            <asp:ValidationSummary ID="ValidationSummary1" runat="server" CssClass="val-summary" HeaderText="Please correct the following errors:" />

            <!-- 1. Full Name -->
            <div class="form-row">
                <label>Full Name:</label>
                <asp:TextBox ID="txtname" runat="server" CssClass="form-control" placeholder="e.g. Peal Keyur Ankhwala"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvName" runat="server" ControlToValidate="txtname" ErrorMessage="Full name is required" CssClass="validator">* Full name required</asp:RequiredFieldValidator>
            </div>

            <!-- 2. Address -->
            <div class="form-row">
                <label>Residential Address:</label>
                <asp:TextBox ID="txtadd" runat="server" TextMode="MultiLine" Rows="2" CssClass="form-control"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvAddress" runat="server" ControlToValidate="txtadd" ErrorMessage="Address is required" CssClass="validator">* Address required</asp:RequiredFieldValidator>
            </div>

            <!-- 3. Birthdate -->
            <div class="form-row">
                <label>Birthdate:</label>
                <asp:TextBox ID="txtbirth" runat="server" TextMode="Date" CssClass="form-control"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvBirth" runat="server" ControlToValidate="txtbirth" ErrorMessage="Birthdate is required" CssClass="validator">* Birthdate required</asp:RequiredFieldValidator>
            </div>

            <!-- 4. Gender (RadioButtons) -->
            <div class="form-row">
                <label>Gender:</label>
                <asp:RadioButton ID="RadioButton1" runat="server" GroupName="gender" Text="Male" Checked="true" />
                <asp:RadioButton ID="RadioButton2" runat="server" GroupName="gender" Text="Female" />
            </div>

            <!-- 5. Hobbies (CheckBoxes) -->
            <div class="form-row">
                <label>Hobbies:</label>
                <asp:CheckBox ID="CheckBox1" runat="server" Text="Reading" Checked="true" />
                <asp:CheckBox ID="CheckBox2" runat="server" Text="Playing" />
                <asp:CheckBox ID="CheckBox3" runat="server" Text="Dancing" />
            </div>

            <!-- 6. Age -->
            <div class="form-row">
                <label>Age:</label>
                <asp:TextBox ID="txtage" runat="server" CssClass="form-control" placeholder="e.g. 20"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvAge" runat="server" ControlToValidate="txtage" ErrorMessage="Age is required" CssClass="validator">* Age required</asp:RequiredFieldValidator>
                <asp:RangeValidator ID="rvAge" runat="server" ControlToValidate="txtage" MinimumValue="16" MaximumValue="100" Type="Integer" ErrorMessage="Age must be between 16 and 100" CssClass="validator">* Range: 16-100</asp:RangeValidator>
            </div>

            <!-- 7. Username -->
            <div class="form-row">
                <label>Username:</label>
                <asp:TextBox ID="txtuser" runat="server" CssClass="form-control" placeholder="e.g. peal@2214"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvUser" runat="server" ControlToValidate="txtuser" ErrorMessage="Username is required" CssClass="validator">* Username required</asp:RequiredFieldValidator>
            </div>

            <!-- 8. Password -->
            <div class="form-row">
                <label>Password:</label>
                <asp:TextBox ID="txtpswd" runat="server" TextMode="Password" CssClass="form-control"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvPass" runat="server" ControlToValidate="txtpswd" ErrorMessage="Password is required" CssClass="validator">* Password required</asp:RequiredFieldValidator>
            </div>

            <!-- 9. Confirm Password -->
            <div class="form-row">
                <label>Confirm Password:</label>
                <asp:TextBox ID="txtconfirm" runat="server" TextMode="Password" CssClass="form-control"></asp:TextBox>
                <asp:CompareValidator ID="cvPass" runat="server" ControlToValidate="txtconfirm" ControlToCompare="txtpswd" ErrorMessage="Passwords must match" CssClass="validator">* Passwords do not match</asp:CompareValidator>
            </div>

            <!-- 10. Email -->
            <div class="form-row">
                <label>Email Address:</label>
                <asp:TextBox ID="txtemail" runat="server" CssClass="form-control" placeholder="name@domain.com"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ControlToValidate="txtemail" ErrorMessage="Email is required" CssClass="validator">* Email required</asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="revEmail" runat="server" ControlToValidate="txtemail" ValidationExpression="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" ErrorMessage="Invalid email format" CssClass="validator">* Invalid email pattern</asp:RegularExpressionValidator>
            </div>

            <!-- 11. User Type -->
            <div class="form-row">
                <label>User Role:</label>
                <asp:DropDownList ID="DropDownList1" runat="server" CssClass="form-control">
                    <asp:ListItem Value="Student">Student</asp:ListItem>
                    <asp:ListItem Value="Faculty">Faculty</asp:ListItem>
                    <asp:ListItem Value="Admin">Admin</asp:ListItem>
                </asp:DropDownList>
            </div>

            <!-- 12. Mobile Number -->
            <div class="form-row">
                <label>Mobile Number (10 Digits):</label>
                <asp:TextBox ID="txtno" runat="server" MaxLength="10" CssClass="form-control" placeholder="9825012345"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvMobile" runat="server" ControlToValidate="txtno" ErrorMessage="Mobile number is required" CssClass="validator">* Mobile required</asp:RequiredFieldValidator>
                <asp:CustomValidator ID="CustomValidator1" runat="server" ControlToValidate="txtno" OnServerValidate="CustomValidator1_ServerValidate" ErrorMessage="Mobile number must be exactly 10 digits" CssClass="validator">* Must be 10 digits</asp:CustomValidator>
            </div>

            <div style="margin-top: 25px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                <asp:Button ID="btnsubmit" runat="server" Text="Submit Registration" OnClick="btnsubmit_Click" CssClass="btn" />
                <asp:Button ID="btnreset" runat="server" Text="Reset Form" OnClick="btnreset_Click" CausesValidation="false" CssClass="btn btn-reset" />
            </div>

            <asp:Label ID="lblStatus" runat="server" style="margin-top: 15px; display: block; font-weight: 600;"></asp:Label>
        </div>
    </form>
</body>
</html>
