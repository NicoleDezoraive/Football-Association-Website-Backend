var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");

router.use((req, res, next) => {
  console.log("temes routs");
  next();
});

/*******************************ROUTERS***************************************/

/**
 * A function that previews a set of IDs of teams that sent as a parameter
 * (section  7 - Group Association Card)
 */
router.get("/previewTeamInfo/ids/:teamsID", async (req, res, next) => {
  try {
    const idArray = JSON.parse(req.params.teamsID);
    const dictTeamInfo = await teams_utils.getTeamsInfo(idArray);
    res.status(200).send(dictTeamInfo);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


/**
 * A function that displays a full view for the ID of a team sent as a parameter
 * (section  7 - Group Association Card) 
 */
router.get("/fullTeamInfo/id/:teamId", async (req, res, next) => {
  try {
    const team_id =req.params.teamId;
    let teams_id_list = [];
    const team_details = await teams_utils.getPlayersByTeam(team_id);
    teams_id_list.push({players: team_details});
    const games_team = await teams_utils.getHistoryGamesTeam(team_id);
    teams_id_list.push({historyGames:games_team});
    const games_future_team = await teams_utils.getFutureGamesTeam(team_id);
    teams_id_list.push({FutureGames:games_future_team});
    res.status(200).send(teams_id_list);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
