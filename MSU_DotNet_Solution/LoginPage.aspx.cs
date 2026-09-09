using System;
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
            string query = "SELECT COUNT(*) FROM dbo.regdb WHERE username=@unm AND password=@pwd AND usertype=@ut";

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@unm", SqlDbType.VarChar, 50) { Value = txtname.Text.Trim() },
                new SqlParameter("@pwd", SqlDbType.VarChar, 50) { Value = txtpassword.Text.Trim() },
                new SqlParameter("@ut", SqlDbType.VarChar, 50) { Value = DropDownList1.SelectedValue }
            };

            try
            {
                object result = DatabaseHelper.ExecuteScalar(query, parameters);
                int count = Convert.ToInt32(result);

                if (count == 1)
                {
                    Session["username"] = txtname.Text.Trim();
                    Session["usertype"] = DropDownList1.SelectedValue;

                    if (DropDownList1.SelectedValue == "Student")
                    {
                        Response.Redirect("StudentArea.aspx");
                    }
                    else if (DropDownList1.SelectedValue == "Faculty")
                    {
                        Response.Redirect("FacultyHome.aspx");
                    }
                    else if (DropDownList1.SelectedValue == "Admin")
                    {
                        Response.Redirect("AdminHome.aspx");
                    }
                }
                else
                {
                    lblMsg.Text = "Invalid username, password, or user role.";
                }
            }
            catch (Exception ex)
            {
                lblMsg.Text = "Error: " + ex.Message;
            }
        }
    }
}
