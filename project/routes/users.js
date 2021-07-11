var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const game_utils = require("./utils/game_utils");


/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});



/**
 * This path gets body with Game Id and save this game in the favorites list of the logged-in user
 * (section  10 - User Favorites)  
*/
router.post("/addFavoriteGames", async (req, res, next) => {
  try {
    const user = req.session.user_id;
    const game = req.body.game_id;
    const games = await DButils.execQuery(
      `SELECT game_id FROM dbo.favoriteGames where user_id = '${user}'`
    );
    const gamesByTime = await DButils.execQuery(
      `select game_id from dbo.games where date < GETDATE() ORDER BY date asc ;`
     );

    if (games.find((x) => x.game_id == game))
      throw { status: 409, message: "This game is allready added" };
      
    if (gamesByTime.find((x) => x.game_id == game))
      throw { status: 409, message: "This game is allready done" };
      
    await users_utils.markGameAsFavorite(user, game);
    res.status(201).send("The game successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns the favorites games that were saved by the logged-in user
 * (section  10 - User Favorites) 
 */
router.get("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const games_ids = await users_utils.getFavoriteGames(user_id);
    let game_ids_array = [];
    if(games_ids.length==0)
       throw { status: 404, message: "favorite games not found" };
    games_ids.map((element) => game_ids_array.push(element.game_id)); //extracting the games ids into array
    const results = await game_utils.getFutureGamesInfo(game_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns at most 3 favorites future games that were saved by the logged-in user
 * (section  5 - The main page of the site is connected to the user) 
 */
router.get("/showThreeFavoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const games_ids = await users_utils.getFavoriteGames(user_id);
    let game_ids_array = [];
    if(games_ids.length==0)
       throw { status: 404, message: "favorite games not found" };
    games_ids.map((element) => game_ids_array.push(element.game_id)); //extracting the games ids into array    
    const results = await game_utils.get3FutureGamesInfo(game_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
