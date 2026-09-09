import { logAdoOperation } from './db';

export const simulateRegistrationInsert = (userData) => {
  const csharpCode = `using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString))
{
    string query = @"INSERT INTO dbo.regdb 
        (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile) 
        VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno)";

    using (SqlCommand cmd = new SqlCommand(query, con))
    {
        cmd.Parameters.Add("@nm", SqlDbType.VarChar, 50).Value = "${userData.name}";
        cmd.Parameters.Add("@add", SqlDbType.VarChar, 255).Value = "${userData.address}";
        cmd.Parameters.Add("@bdt", SqlDbType.VarChar, 50).Value = "${userData.birthdate}";
        cmd.Parameters.Add("@gen", SqlDbType.VarChar, 50).Value = "${userData.gender}";
        cmd.Parameters.Add("@hob", SqlDbType.VarChar, 100).Value = "${userData.hobbies}";
        cmd.Parameters.Add("@age", SqlDbType.VarChar, 10).Value = "${userData.age}";
        cmd.Parameters.Add("@unm", SqlDbType.VarChar, 50).Value = "${userData.username}";
        cmd.Parameters.Add("@pwd", SqlDbType.VarChar, 50).Value = "${userData.password}";
        cmd.Parameters.Add("@cpwd", SqlDbType.VarChar, 50).Value = "${userData.confirmpassword}";
        cmd.Parameters.Add("@email", SqlDbType.VarChar, 100).Value = "${userData.email}";
        cmd.Parameters.Add("@ut", SqlDbType.VarChar, 50).Value = "${userData.usertype}";
        cmd.Parameters.Add("@mno", SqlDbType.Decimal).Value = ${userData.mobile}m;

        con.Open();
        int rowsAffected = cmd.ExecuteNonQuery();
        con.Close();
    }
}`;

  const vbCode = `Dim con As New SqlConnection(WebConfigurationManager.ConnectionStrings("con").ConnectionString)
Dim cmd As New SqlCommand("INSERT INTO dbo.regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile) VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno)", con)

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

con.Open()
cmd.ExecuteNonQuery()
con.Close()`;

  return logAdoOperation({
    title: 'INSERT dbo.regdb Record',
    type: 'ExecuteNonQuery',
    table: 'dbo.regdb',
    query: 'INSERT INTO dbo.regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile) VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno)',
    parameters: userData,
    csharpCode,
    vbCode
  });
};

export const simulateLoginQuery = (username, password, usertype) => {
  const csharpCode = `using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString))
{
    string query = "SELECT COUNT(*) FROM dbo.regdb WHERE username=@unm AND password=@pwd AND usertype=@ut";
    using (SqlCommand cmd = new SqlCommand(query, con))
    {
        cmd.Parameters.Add("@unm", SqlDbType.VarChar, 50).Value = "${username}";
        cmd.Parameters.Add("@pwd", SqlDbType.VarChar, 50).Value = "${password}";
        cmd.Parameters.Add("@ut", SqlDbType.VarChar, 50).Value = "${usertype}";

        con.Open();
        int count = Convert.ToInt32(cmd.ExecuteScalar());
        con.Close();

        if (count == 1) {
            Session["username"] = "${username}";
            Session["usertype"] = "${usertype}";
        }
    }
}`;

  const vbCode = `Dim con As New SqlConnection(WebConfigurationManager.ConnectionStrings("con").ConnectionString)
Dim cmd As New SqlCommand("SELECT COUNT(*) FROM dbo.regdb WHERE username=@unm AND password=@pwd AND usertype=@ut", con)

cmd.Parameters.Add("@unm", SqlDbType.VarChar, 50).Value = txtname.Text
cmd.Parameters.Add("@pwd", SqlDbType.VarChar, 50).Value = txtpassword.Text
cmd.Parameters.Add("@ut", SqlDbType.VarChar, 50).Value = DropDownList1.SelectedValue

con.Open()
Dim cnt As Integer = cmd.ExecuteScalar()
con.Close()

If cnt = 1 Then
    Session("username") = txtname.Text
End If`;

  return logAdoOperation({
    title: 'SELECT COUNT Auth Validation',
    type: 'ExecuteScalar',
    table: 'dbo.regdb',
    query: 'SELECT COUNT(*) FROM dbo.regdb WHERE username=@unm AND password=@pwd AND usertype=@ut',
    parameters: { username, password: '***', usertype },
    csharpCode,
    vbCode
  });
};

export const simulateFeedbackInsert = (name, feedback) => {
  const csharpCode = `using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString))
{
    string query = "INSERT INTO dbo.fd_table (name, feedback) VALUES (@e, @f)";
    using (SqlCommand cmd = new SqlCommand(query, con))
    {
        cmd.Parameters.Add("@e", SqlDbType.VarChar, 50).Value = "${name}";
        cmd.Parameters.Add("@f", SqlDbType.VarChar).Value = "${feedback}";

        con.Open();
        cmd.ExecuteNonQuery();
        con.Close();
    }
}`;

  const vbCode = `Dim con As New SqlConnection(WebConfigurationManager.ConnectionStrings("con").ConnectionString)
Dim cmd As New SqlCommand("INSERT INTO dbo.fd_table (name, feedback) VALUES (@e, @f)", con)

cmd.Parameters.Add("@e", SqlDbType.VarChar, 50).Value = TextBox3.Text
cmd.Parameters.Add("@f", SqlDbType.VarChar, 50).Value = TextBox4.Text

con.Open()
cmd.ExecuteNonQuery()
con.Close()`;

  return logAdoOperation({
    title: 'INSERT dbo.fd_table Entry',
    type: 'ExecuteNonQuery',
    table: 'dbo.fd_table',
    query: 'INSERT INTO dbo.fd_table (name, feedback) VALUES (@e, @f)',
    parameters: { name, feedback },
    csharpCode,
    vbCode
  });
};

export const simulateGridViewDataBind = () => {
  const csharpCode = `using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString))
{
    string query = "SELECT * FROM dbo.fd_table ORDER BY id DESC";
    using (SqlDataAdapter da = new SqlDataAdapter(query, con))
    {
        DataSet ds = new DataSet();
        da.Fill(ds, "F");
        GridView1.DataSource = ds.Tables["F"];
        GridView1.DataBind();
    }
}`;

  const vbCode = `Dim con As New SqlConnection(WebConfigurationManager.ConnectionStrings("con").ConnectionString)
Dim cmd As New SqlCommand("SELECT * FROM dbo.fd_table", con)
Dim da As New SqlDataAdapter(cmd)
Dim ds As New DataSet()

da.Fill(ds, "F")
GridView1.DataSource = ds.Tables("F")
Me.DataBind()`;

  return logAdoOperation({
    title: 'SqlDataAdapter & DataSet Fill to GridView',
    type: 'SqlDataAdapter.Fill',
    table: 'dbo.fd_table',
    query: 'SELECT * FROM dbo.fd_table',
    parameters: {},
    csharpCode,
    vbCode
  });
};
