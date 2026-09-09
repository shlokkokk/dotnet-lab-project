using System.Data;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();

string dbPath = Path.Combine(app.Environment.ContentRootPath, "academic_portal.db");
string connectionString = $"Data Source={dbPath}";

// Initialize Database Tables
using (var con = new SqliteConnection(connectionString))
{
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = @"
        CREATE TABLE IF NOT EXISTS regdb (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            birthdate TEXT NOT NULL,
            gender TEXT NOT NULL,
            hobbies TEXT NOT NULL,
            age TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            confirmpassword TEXT NOT NULL,
            email TEXT NOT NULL,
            usertype TEXT NOT NULL,
            mobile TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS fd_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            feedback TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS student_electives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            elective_name TEXT NOT NULL,
            allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ";
    cmd.ExecuteNonQuery();

    // Reset regdb with Shlok Shah updated profile
    cmd.CommandText = "DELETE FROM regdb;";
    cmd.ExecuteNonQuery();

    cmd.CommandText = @"
        INSERT INTO regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile)
        VALUES 
        ('Shlok Shah', 'Vadodara, Gujarat', '2008-12-04', 'Male', 'Coding, Technology', '17', 'shlok', 'Admin@412', 'Admin@412', 'shlokshah412@gmail.com', 'Admin', '9512345504');
    ";
    cmd.ExecuteNonQuery();
}

// 1. Health Status
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "Active",
    framework = ".NET 10.0 (C# Server Engine)",
    provider = "ADO.NET Core Data Provider",
    database = "academic_portal.db",
    timestamp = DateTime.UtcNow
}));

// 2. Fetch All Registered Users
app.MapGet("/api/users", () =>
{
    var list = new List<Dictionary<string, object>>();
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "SELECT * FROM regdb ORDER BY id DESC;";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        var row = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
            row[reader.GetName(i)] = reader.GetValue(i);
        }
        list.Add(row);
    }
    return Results.Ok(list);
});

// 3. User Registration (ADO.NET Parameterized Insert)
app.MapPost("/api/users/register", ([FromBody] UserDto dto) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = @"
        INSERT INTO regdb (name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile)
        VALUES (@nm, @add, @bdt, @gen, @hob, @age, @unm, @pwd, @cpwd, @email, @ut, @mno);
        SELECT last_insert_rowid();
    ";
    cmd.Parameters.AddWithValue("@nm", dto.Name);
    cmd.Parameters.AddWithValue("@add", dto.Address);
    cmd.Parameters.AddWithValue("@bdt", dto.Birthdate);
    cmd.Parameters.AddWithValue("@gen", dto.Gender);
    cmd.Parameters.AddWithValue("@hob", dto.Hobbies);
    cmd.Parameters.AddWithValue("@age", dto.Age);
    cmd.Parameters.AddWithValue("@unm", dto.Username);
    cmd.Parameters.AddWithValue("@pwd", dto.Password);
    cmd.Parameters.AddWithValue("@cpwd", dto.Confirmpassword);
    cmd.Parameters.AddWithValue("@email", dto.Email);
    cmd.Parameters.AddWithValue("@ut", dto.Usertype);
    cmd.Parameters.AddWithValue("@mno", dto.Mobile);

    try
    {
        long newId = (long)(cmd.ExecuteScalar() ?? 0);
        return Results.Ok(new { success = true, id = newId, message = "Record inserted into dbo.regdb via ADO.NET." });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, error = ex.Message });
    }
});

// 4. Authentication Login (ADO.NET ExecuteScalar)
app.MapPost("/api/auth/login", ([FromBody] LoginDto dto) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "SELECT COUNT(*) FROM regdb WHERE (username=@unm OR email=@unm) AND password=@pwd AND usertype=@ut;";
    cmd.Parameters.AddWithValue("@unm", dto.Username);
    cmd.Parameters.AddWithValue("@pwd", dto.Password);
    cmd.Parameters.AddWithValue("@ut", dto.Usertype);

    long count = (long)(cmd.ExecuteScalar() ?? 0);
    if (count == 1)
    {
        using var fetchCmd = con.CreateCommand();
        fetchCmd.CommandText = "SELECT * FROM regdb WHERE (username=@unm OR email=@unm);";
        fetchCmd.Parameters.AddWithValue("@unm", dto.Username);
        using var reader = fetchCmd.ExecuteReader();
        if (reader.Read())
        {
            var user = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                user[reader.GetName(i)] = reader.GetValue(i);
            }
            return Results.Ok(new { success = true, user, sessionId = Guid.NewGuid().ToString() });
        }
    }
    return Results.Unauthorized();
});

// 5. Delete User (ADO.NET ExecuteNonQuery)
app.MapDelete("/api/users/{id}", (long id) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "DELETE FROM regdb WHERE id=@id;";
    cmd.Parameters.AddWithValue("@id", id);
    int affected = cmd.ExecuteNonQuery();
    return Results.Ok(new { success = affected > 0, rowsAffected = affected });
});

// 6. Feedback GridView Fetch
app.MapGet("/api/feedback", () =>
{
    var list = new List<Dictionary<string, object>>();
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "SELECT * FROM fd_table ORDER BY id DESC;";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        var row = new Dictionary<string, object>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
            row[reader.GetName(i)] = reader.GetValue(i);
        }
        list.Add(row);
    }
    return Results.Ok(list);
});

// 7. Insert Feedback
app.MapPost("/api/feedback", ([FromBody] FeedbackDto dto) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "INSERT INTO fd_table (name, feedback, rating) VALUES (@name, @fb, @rt);";
    cmd.Parameters.AddWithValue("@name", dto.Name);
    cmd.Parameters.AddWithValue("@fb", dto.Feedback);
    cmd.Parameters.AddWithValue("@rt", dto.Rating);
    int affected = cmd.ExecuteNonQuery();
    return Results.Ok(new { success = affected > 0, message = "Feedback saved to dbo.fd_table." });
});

// 8. Dynamic Student Electives
app.MapGet("/api/electives/{username}", (string username) =>
{
    var list = new List<string>();
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var cmd = con.CreateCommand();
    cmd.CommandText = "SELECT elective_name FROM student_electives WHERE username=@unm;";
    cmd.Parameters.AddWithValue("@unm", username);
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        list.Add(reader.GetString(0));
    }
    return Results.Ok(list);
});

app.MapPost("/api/electives/{username}", (string username, [FromBody] List<string> electives) =>
{
    using var con = new SqliteConnection(connectionString);
    con.Open();
    using var delCmd = con.CreateCommand();
    delCmd.CommandText = "DELETE FROM student_electives WHERE username=@unm;";
    delCmd.Parameters.AddWithValue("@unm", username);
    delCmd.ExecuteNonQuery();

    foreach (var ele in electives)
    {
        using var insCmd = con.CreateCommand();
        insCmd.CommandText = "INSERT INTO student_electives (username, elective_name) VALUES (@unm, @ele);";
        insCmd.Parameters.AddWithValue("@unm", username);
        insCmd.Parameters.AddWithValue("@ele", ele);
        insCmd.ExecuteNonQuery();
    }
    return Results.Ok(new { success = true, count = electives.Count });
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
var url = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? $"http://0.0.0.0:{port}";
app.Run(url);

public record UserDto(string Name, string Address, string Birthdate, string Gender, string Hobbies, string Age, string Username, string Password, string Confirmpassword, string Email, string Usertype, string Mobile);
public record LoginDto(string Username, string Password, string Usertype);
public record FeedbackDto(string Name, string Feedback, int Rating);
