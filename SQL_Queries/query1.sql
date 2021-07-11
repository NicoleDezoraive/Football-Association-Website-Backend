--create games table
CREATE TABLE [dbo].[games](
	[game_id] [int] IDENTITY(1,1) NOT NULL,
	[date] [Date] NOT NULL ,
	[time] [time] NOT NULL,
	[home_team] [varchar](30)  NOT NULL,
	[away_team] [varchar](30)  NOT NULL,
	[stage] [varchar](30)  NOT NULL,
	[result] [varchar](30),
	[referee] [varchar](30),
	PRIMARY KEY (game_id)
)


DROP TABLE [dbo].[games_old]