--create users table
CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL,
	[firstname] [varchar](30)  NOT NULL,
	[lastname] [varchar](30)  NOT NULL,
	[country] [varchar](30)  NOT NULL,
	[email] [varchar](100)  NOT NULL,
	[picture] [varchar](300)  NOT NULL,

)