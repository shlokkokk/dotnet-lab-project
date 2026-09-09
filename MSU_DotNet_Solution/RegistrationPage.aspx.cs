using System;
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
}
