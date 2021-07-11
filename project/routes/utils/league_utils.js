const axios = require("axios");
const DButils = require("./DButils");
const game_utils = require("./game_utils");
const LEAGUE_ID = 271;
const api_token='Kur1dw8WemaeIXjJnjlKGmn5PyUGzIRLoZeUPIQU0Qu4tLg8eWYNeGFp05r5';
//const api_token='RSCxxlXzfL1NAjlkGFPkdEcBKUyKcdqJ6SxUlFl9CwGgp6W55qHKuRV0Jpxa';

/**
 * This function returns the preview of current league  from API and details about next game from DB
 */
async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        //api_token: process.env.api_token,
        api_token: api_token,
      },
    }
  );
  
  const next_game = await DButils.execQuery(
    `select TOP 1 date, time, home_team, away_team, stage  from dbo.games where date >= GETDATE() ORDER BY date`
    );

  if (league.data.data.current_stage_id == null)
    {
      const stage = "The current stage has not yet begun";
      return {
        league_name: league.data.data.name,
        current_season_name: league.data.data.season.data.name,
        current_stage_name: stage,
        next_game };
    }

  else{
    const stage = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
      {
        params: {
          //api_token: process.env.api_token,
        api_token: api_token,
        },
      }
    );
  }

  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    next_game 
  };
}

/**
 * This function add new game to DB
 * @param {*} date 
 * @param {*} time 
 * @param {*} home_team 
 * @param {*} away_team 
 * @param {*} stage 
 * @param {*} referee 
 */
async function  addGame(date, time, home_team, away_team, stage, referee){
  const gameID = await DButils.execQuery(
    `select game_id from dbo.games where date='${date}' AND home_team='${home_team}' AND away_team='${away_team}' `
  );
  if(gameID.length != 0){
    throw {status: 409, message: "The game already exists in the system, you can not add the same game on the same day" };
  }
  await DButils.execQuery(
    `INSERT INTO dbo.games (date, time, home_team, away_team, stage, referee) VALUES
     ('${date}', '${time}', '${home_team}', '${away_team}', '${stage}' , '${referee}')`
  );
}

/**
 * This function update result to game that save in DB, game must be end befor add results
 * @param {*} gameID 
 * @param {*} result 
 */
async function addResult(gameID, result) {
  await DButils.execQuery(
    `UPDATE dbo.games
    SET result = '${result}'
    WHERE game_id='${gameID}' AND date < GETDATE() `
 );
}

/**
 * This function add new evet to spesific game
 * @param {*} gameID 
 * @param {*} date 
 * @param {*} time 
 * @param {*} minute 
 * @param {*} description 
 */
async function addEvent(gameID, date, time, minute, description) {
  await DButils.execQuery(
    `INSERT INTO dbo.events (game_id, date, time, minute, description) VALUES
     ('${gameID}', '${date}', '${time}', '${minute}', '${description}')`
 
 );
}

/**
 * This function return all games that in current league, past games and future games
 * @returns all games that in current league, past games and future games
 */
async function getLeagueGames() {
  const cerrent = await game_utils.getCurrentGames();
  const past = await game_utils.getPastGames();
   return {
    cerrent,
    past
   };
}


/**
 * This function return game ID only if game ID is exist in DB and date game is pass
 * @param {*} gameID 
 * @returns game ID only if game ID is exist in DB and date game is pass
 */
async function checkDateGame(gameID) {
  const  result= await DButils.execQuery(
    `select game_id from dbo.games where game_id='${gameID}' AND  date <= GETDATE()`);
  return result;
}



/*******************************  exports  **********************************/
exports.getLeagueDetails = getLeagueDetails;
exports.addGame = addGame;
exports.addResult = addResult;
exports.addEvent = addEvent;
exports.getLeagueGames = getLeagueGames;
exports.checkDateGame = checkDateGame;