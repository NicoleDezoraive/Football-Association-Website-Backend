var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

router.use((req, res, next) => {
    console.log("players routs");
    next();
  });

/*******************************ROUTERS***************************************/

/**
 * A function that previews a set of IDs of players that sent as a parameter
 * (section  6 - Player's Association Card)
 */
router.get("/previewPlayerInfo/ids/:playerID", async (req, res, next) => {
  try {
    const idArray = JSON.parse(req.params.playerID);
    const dictPleayerInfo = await players_utils.getPlayersInfo(idArray);
    res.status(200).send(dictPleayerInfo);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


/**
 * Function that displays a complete view of a set of player IDs sent as a parameter
 * (section  6 - Player's Association Card)
 */
router.get("/fullPlayerInfo/ids/:playersID",async function (req, res, next) {
      try {
        const idArray = JSON.parse(req.params.playersID);
        const dictRecipeInfo = await players_utils.getFullPlayerInfo(idArray);
        res.status(200).send(dictRecipeInfo);
      } catch (error) {
        console.log(error);
        next(error);
      }
});

   
module.exports = router;
