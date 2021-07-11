const axios = require("axios");
const DButils = require("./DButils");
const game_utils = require("./game_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
//const api_token='OMfd2Pc31vLIQeolQqEjY4SlLPGkYhHFJ343AauoKbhe4BMDfZYOxWe407pT';
//const api_token='RSCxxlXzfL1NAjlkGFPkdEcBKUyKcdqJ6SxUlFl9CwGgp6W55qHKuRV0Jpxa';
//const api_token='UdEygKk8iC2Nu5pGFQWzCo5Hw81zJDShiLPK0KJuxhmRohsc7HDTs2LOsrxn'//nwghbrns2@gmail.com
//const api_token='O7dcp5Z2O05s1dAnvRPAqcOv2DImwhnUUk80U0L1DGYA4CPVP8B5yvexbp8c'//H34DSH0R@gMAIL.COM
const api_token='WpGqKUPcNtxiV7M9gmn8cYC1k5X2m719Q6ImUpaod8CSolhtYxZJ3KmYiiub'
const players_utils = require("./players_utils");

/***************************** preview Team Info *******************************/

/**
 * A function which is responsible for previewing the list of temas that will receive
 * @param {*} teams_ids_list The teams we would like to preview
 * @returns Preview of the teams we sent
 */
async function getTeamsInfo(teams_ids_list) {
  let promises = [];
  teams_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/teams/${id}`, {
        params: {
          include: "league",
          //api_token: process.env.api_token,
          api_token: api_token,
        },
      })
    )
  );
  let teams_info = await Promise.all(promises);
  return extractRelevantTeamData(teams_info);
}

/**
 * Function which is responsible Click the relevant preview information for teams in the league
 * @param {*} teams_info Fill in information for each team we sent
 * @returns Relevant teams with the relevant information
 */
function extractRelevantTeamData(teams_info) {
  return teams_info.map((team_info) => {
      const { id, name, logo_path } = team_info.data.data;
      return {
        id: id,
        name: name,
        logo_path: logo_path,
      };
  });
}


/***************************** full Team Info*******************************/

/**
 * A function which is responsible for issuing a list of players of the sent team
 * @param {*} team_id Of the team for which we would like to look for its players
 * @returns List of players on the team
 */
async function getPlayersByTeam(team_id) {
  let player_ids_list = await players_utils.getPlayerIdsByTeam(team_id);
  let players_info = await players_utils.getPlayersInfo(player_ids_list);
  return players_info;
}

/**
 * A function which is responsible for extracting from what DB the future games of a desired team
 * @param {*} team_id 
 * @returns Returns a list of future team games
 */
async function getFutureGamesTeam(team_id) {
  const games_info = await DButils.execQuery(
    `select  game_id, date, time, home_team, away_team, stage, referee  from dbo.games where  date >= GETDATE() AND (home_team =(${team_id}) OR away_team =(${team_id})) `
  );
  return games_info;
}

/**
 * A function which is responsible for returning the past games of the team we want
 * @param {*} team_id 
 * @returns Returns a list of past team games
 */
async function getHistoryGamesTeam(team_id) {
  const pastGames = await game_utils.getPastGames();
  // const games_info = await DButils.execQuery(
  //   `select  game_id, date, time, home_team, away_team, stage, result, referee, event  from (${pastGames}) where  date <= GETDATE() AND (home_team =(${team_id}) OR away_team =(${team_id})) `
  // );
  
  return pastGames;
}

function extractRelevantTeamDataForSearch(teams_info) {
  return teams_info.map((team_info) => {
      const { id, name, logo_path } = team_info;
      return {
        id: id,
        name: name,
        logo_path: logo_path,
      };
  });
}


/*******************************  exports  **********************************/
exports.getHistoryGamesTeam= getHistoryGamesTeam;
exports.getFutureGamesTeam= getFutureGamesTeam;
exports.getPlayersByTeam = getPlayersByTeam;
exports.getTeamsInfo = getTeamsInfo;
exports.extractRelevantTeamDataForSearch = extractRelevantTeamDataForSearch;

