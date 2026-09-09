using System;
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
}
