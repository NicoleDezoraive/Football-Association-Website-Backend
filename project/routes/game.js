var express = require("express");
var router = express.Router();
const game_utils = require("./utils/game_utils");

router.use((req, res, next) => {
  console.log("game routs");
  next();
});

/*******************************ROUTERS***************************************/

/**
 * This function displays the details of the games that have not yet taken place
 * (section  9 - Current Cycle Games Page)
 */
router.get("/currentCycleGames", async (req, res, next) => {
  try {
    const currentGames = await game_utils.getCurrentGames();
    res.status(200).send(currentGames);
  } catch (error) {
    next(error);
  }
});

/**
 * This function displays the details of the games that took place
 * (section  9 - Current Cycle Games Page)
 */
router.get("/pastGames", async (req, res, next) => {
  try {
    const pastGames = await game_utils.getPastGames();
    res.status(200).send(pastGames);
  } catch (error) {
    next(error);
  }
});


module.exports = router;