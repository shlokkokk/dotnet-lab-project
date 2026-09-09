using System;
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
}
