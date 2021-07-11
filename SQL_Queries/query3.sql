-- Insert rows into table 'dbo.games'
INSERT INTO dbo.games
    ( -- columns to insert data into
    [date], [time], [home_team], [away_team], [stage], [referee]
    )
VALUES
    ( -- first row: values for the columns in the list above
         '2021-07-02', '12:00:00', '939', '211', '342', 'A'
    )
-- add more rows here
GO

INSERT INTO dbo.events
    ( -- columns to insert data into
    [game_id], [date], [time], [minute], [description]
    )
VALUES
    ( 
         8,'08-05-2021' ,'12:30:00', '30', 'goal to Kim')
-- add more rows here
GO