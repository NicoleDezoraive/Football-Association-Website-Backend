--create events table
CREATE TABLE [dbo].[events](
	[event_id] [int] IDENTITY(1,1) NOT NULL,
	[game_id] [int] NOT NULL,
	[date] [Date] NOT NULL ,
	[time] [time] NOT NULL,
	[minute] [varchar](30),
	[description] [varchar] (30),
	PRIMARY KEY (event_id),
	FOREIGN KEY (game_id) REFERENCES dbo.games(game_id),
)