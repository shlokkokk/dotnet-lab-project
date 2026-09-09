USE [master];
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'MSU_AcademicDB')
BEGIN
    CREATE DATABASE [MSU_AcademicDB];
END
GO

USE [MSU_AcademicDB];
GO

-- 1. Table for User Registration & Authentication
IF OBJECT_ID(N'dbo.regdb', N'U') IS NOT NULL
    DROP TABLE dbo.regdb;
GO

CREATE TABLE dbo.regdb (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    birthdate VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    hobbies VARCHAR(100) NOT NULL,
    age VARCHAR(10) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    confirmpassword VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    usertype VARCHAR(50) NOT NULL,
    mobile DECIMAL(18, 0) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 2. Table for Feedback System
IF OBJECT_ID(N'dbo.fd_table', N'U') IS NOT NULL
    DROP TABLE dbo.fd_table;
GO

CREATE TABLE dbo.fd_table (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    feedback NVARCHAR(MAX) NOT NULL,
    rating INT DEFAULT 5,
    submitted_at DATETIME DEFAULT GETDATE()
);
GO

-- 3. Administrator Seed Record
INSERT INTO dbo.regdb 
(name, address, birthdate, gender, hobbies, age, username, password, confirmpassword, email, usertype, mobile)
VALUES 
('Shlok Shah', 'Vadodara, Gujarat', '2008-12-04', 'Male', 'Coding, Technology', '17', 'shlok', 'Admin@412', 'Admin@412', 'shlokshah412@gmail.com', 'Admin', 9512345504);
GO
