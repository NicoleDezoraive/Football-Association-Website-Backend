const DButils = require("./DButils");

/***************************** Current Cycle Games Page *******************************/

/**
 * This function is responsible for retrieving the games that have not yet taken place from the DB
 * @returns Games that have not yet taken place
 */
async function getCurrentGames() {
  const future_games = await DButils.execQuery(
    `select game_id, date, time, home_team, away_team, stage ,referee from dbo.games where date >= GETDATE() ORDER BY date;`
  );
  return future_games;
}

/**
 * This function is responsible for retrieving the games that took place from the DB
 * @returns Games that took place
 */
async function getPastGames() {
  const gamesDetails = await DButils.execQuery(
    `select game_id, date, time, home_team, away_team, stage, result , referee  from dbo.games where date < GETDATE() ORDER BY date asc ;`
  );
  const event = await DButils.execQuery(
    `select *  from dbo.events where game_id IN(select game_id from dbo.games where date < GETDATE()) ;`
  );
  return gamesDetails.map((game) => { 
    const { game_id, date, time, home_team, away_team, stage, result, referee } = game;
    const events_list = [];
    const idFromgamesDetails =game_id;
    event.map((e) => { 
      const { event_id, game_id, date, time, minute, description} = e;
      if(game_id==idFromgamesDetails){
        events_list.push( {
          event_id: event_id,
          game_id: game_id,
          date: date,
          time: time,
          minute: minute,
          description: description,
        }  );
      }
    });
    return {
      game_id: game_id,
      date: date,
      time: time,
      home_team: home_team,
      away_team: away_team,
      stage: stage,
      result: result,
      referee: referee,
      event: events_list
    }  
  });
}

/**
 * This function return favorite games list of the logged-in user 
 * @param {*} game_ids_array 
 * @returns 
 */
async function getFutureGamesInfo(game_ids_array) {
  const games_info = await DButils.execQuery(
    `select game_id ,date, time, home_team, away_team, stage, referee  from dbo.games where game_id  IN (${game_ids_array})`
  );
  return games_info;
}


/**
 * This function return 3 favorite games list of the logged-in user 
 * @param {*} game_ids_array 
 * @returns 
 */
async function get3FutureGamesInfo(game_ids_array) {
  const games_info = await DButils.execQuery(
    `select TOP 3 game_id ,date, time, home_team, away_team, stage, referee  from dbo.games where game_id  IN (${game_ids_array}) `
  );
  return games_info;
}


/*******************************  exports  **********************************/ 
exports.getCurrentGames = getCurrentGames;
exports.getPastGames = getPastGames;
exports.getFutureGamesInfo = getFutureGamesInfo;
exports.get3FutureGamesInfo = get3FutureGamesInfo; 