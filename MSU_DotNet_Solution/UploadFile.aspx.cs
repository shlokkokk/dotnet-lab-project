using System;
using System.IO;
using System.Web;
using System.Web.UI;

namespace MSU_DotNet_Web
{
    public partial class UploadFile : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblStatus.Text = string.Empty;
            }
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            if (FileUpload1.HasFile)
            {
                try
                {
                    string targetDir = Server.MapPath("~/images/");
                    if (!Directory.Exists(targetDir))
                    {
                        Directory.CreateDirectory(targetDir);
                    }

                    string filename = Path.GetFileName(FileUpload1.FileName);
                    string savePath = Path.Combine(targetDir, filename);

                    FileUpload1.SaveAs(savePath);

                    lblStatus.ForeColor = System.Drawing.Color.Green;
                    lblStatus.Text = "File Uploaded Successfully to: " + savePath;
                }
                catch (Exception ex)
                {
                    lblStatus.ForeColor = System.Drawing.Color.Red;
                    lblStatus.Text = "Error uploading file: " + ex.Message;
                }
            }
            else
            {
                lblStatus.ForeColor = System.Drawing.Color.Red;
                lblStatus.Text = "Please select a file to upload.";
            }
        }
    }
}
