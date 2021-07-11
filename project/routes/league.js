var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const league_utils = require("./utils/league_utils");
const game_utils = require("./utils/game_utils");

/**
 * This function returns the preview of current league and details about next game
 * (section  5 - League details page, the main page of the site)
 * 
 */
router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.status(200).send(league_details);
  } catch (error) {
    next(error);
  }
});

/**
 * This function is responsible for checking the privileges of the user who is indeed a representative of an association, and who is connected to the system
*/
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id, username  FROM users")
      .then((users) => {
        if (users.find((x) => (x.user_id === req.session.user_id && x.username === 'nicoled'))) {
            req.user_id = req.session.user_id;
            next();
        }
        else {
          res.status(403).send("You do not have the appropriate permissions to perform this operation");
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This function add a new game to DB
 * (section  11 - League Management Page) 
 */
router.post("/addGameToLeague", async (req, res, next) => {
  try {
    const date = req.body.date;
    const time = req.body.time;
    const home_team = req.body.home_team;
    const away_team = req.body.away_team;
    const stage = req.body.stage;
    const referee = req.body.referee;
    await league_utils.addGame(date, time, home_team, away_team, stage, referee);
    res.status(201).send("The game added successfully");
  } catch (error) {
    next(error);
  }
});


/**
 * This function update result to game that save in DB, game must be end befor add results
 * (section  11 - League Management Page, Bonus) 
 */
router.post("/addResultGameInLeague", async (req, res, next) => {
  try {
    const gameID = req.body.game_id;
    const result = req.body.result;
    const date_game = await league_utils.checkDateGame(gameID);
    if (date_game.length == 0)
      throw {status: 404, message: "The game does not exist in the system or has not yet occurred" };

    await league_utils.addResult(gameID, result);
    res.status(201).send("The result game added successfully");
  } catch (error) {
    next(error);
  }
});


/**
 * This function add new evet to spesific game
 * (section  11 - League Management Page, Bonus) 
 */
router.post("/addEventsGameInLeage", async (req, res, next) => {
  try {
    const gameID = req.body.game_id;
    const date = req.body.date;
    const time = req.body.time;
    const minute = req.body.minute;
    const description = req.body.description;

    const date_game = await league_utils.checkDateGame(gameID);
    if (date_game.length == 0)
      throw {status: 404, message: "The game does not exist in the system or has not yet occurred" };
      
    await league_utils.addEvent(gameID, date, time, minute, description );
    res.status(201).send("The event game added successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * This function return all games that in current league, past games and future games
 * (section  11 - League Management Page) 
 */
router.get("/getLeagueGames", async (req, res, next) => {
  try {
    let listLeagueGames = [];
    const past_games = await game_utils.getPastGames();
    listLeagueGames.push(past_games);
    const future_games = await game_utils.getCurrentGames();
    listLeagueGames.push(future_games);
    res.status(200).send(listLeagueGames);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
