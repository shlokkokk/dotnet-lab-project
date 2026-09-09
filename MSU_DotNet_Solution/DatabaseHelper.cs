using System;
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
}
