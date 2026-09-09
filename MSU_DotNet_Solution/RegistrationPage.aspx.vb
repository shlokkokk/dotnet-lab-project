Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Configuration

Public Class registration
    Inherits System.Web.UI.Page

    Dim con As New SqlConnection(WebConfigurationManager.ConnectionStrings("con").ConnectionString)

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If con.State = ConnectionState.Open Then
            con.Close()
        End If
    End Sub

    Protected Sub CustomValidator1_ServerValidate(source As Object, args As ServerValidateEventArgs) Handles CustomValidator1.ServerValidate
        Dim length As Integer = args.Value.Length
        If length = 10 Then
            args.IsValid = True
        Else
            args.IsValid = False
        End If
    End Sub

    Protected Sub btnreset_Click(sender As Object, e As EventArgs) Handles btnreset.Click
        txtname.Text = ""
        txtage.Text = ""
        txtbirth.Text = ""
        txtadd.Text = ""
        txtconfirm.Text = ""
        txtemail.Text = ""
        txtno.Text = ""
        txtpswd.Text = ""
        txtuser.Text = ""
        RadioButton1.Checked = False
        RadioButton2.Checked = False
        CheckBox1.Checked = False
        CheckBox2.Checked = False
        CheckBox3.Checked = False
        DropDownList1.ClearSelection()
    End Sub

    Protected Sub btnsubmit_Click(sender As Object, e As EventArgs) Handles btnsubmit.Click
        If Page.IsValid Then
            Dim query As String = "INSERT INTO dbo.regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile) VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno)"
            Dim cmd As New SqlCommand(query, con)

            Dim gen As String = ""
            If RadioButton1.Checked Then
                gen = RadioButton1.Text
            ElseIf RadioButton2.Checked Then
                gen = RadioButton2.Text
            End If

            Dim h As String = ""
            If CheckBox1.Checked Then h = CheckBox1.Text
            If CheckBox2.Checked Then h = h & ", " & CheckBox2.Text
            If CheckBox3.Checked Then h = h & ", " & CheckBox3.Text

            cmd.Parameters.Add("@nm", SqlDbType.VarChar, 50).Value = txtname.Text
            cmd.Parameters.Add("@add", SqlDbType.VarChar).Value = txtadd.Text
            cmd.Parameters.Add("@bdt", SqlDbType.VarChar).Value = txtbirth.Text
            cmd.Parameters.Add("@gen", SqlDbType.VarChar, 50).Value = gen
            cmd.Parameters.Add("@hob", SqlDbType.VarChar, 50).Value = h
            cmd.Parameters.Add("@age", SqlDbType.VarChar).Value = txtage.Text
            cmd.Parameters.Add("@unm", SqlDbType.VarChar, 50).Value = txtuser.Text
            cmd.Parameters.Add("@pwd", SqlDbType.VarChar, 50).Value = txtpswd.Text
            cmd.Parameters.Add("@cpwd", SqlDbType.VarChar, 50).Value = txtconfirm.Text
            cmd.Parameters.Add("@email", SqlDbType.VarChar, 50).Value = txtemail.Text
            cmd.Parameters.Add("@ut", SqlDbType.VarChar, 50).Value = DropDownList1.SelectedValue
            cmd.Parameters.Add("@mno", SqlDbType.Decimal).Value = CDec(txtno.Text)

            Try
                con.Open()
                cmd.ExecuteNonQuery()
                con.Close()
                Response.Redirect("LoginPage.aspx")
            Catch ex As Exception
                Response.Write("Database Error: " & ex.Message)
            End Try
        End If
    End Sub
End Class
