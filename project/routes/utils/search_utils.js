const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
//const api_token='OMfd2Pc31vLIQeolQqEjY4SlLPGkYhHFJ343AauoKbhe4BMDfZYOxWe407pT';
//const api_token='e2N9saTRNM1Tm8Hj8Zj5nNLJJ8pHX0gIdr5kNPATmvxOM8fBUa7ai1VF94vH';
//const api_token='UdEygKk8iC2Nu5pGFQWzCo5Hw81zJDShiLPK0KJuxhmRohsc7HDTs2LOsrxn'//nwghbrns2@gmail.com
//const api_token='O7dcp5Z2O05s1dAnvRPAqcOv2DImwhnUUk80U0L1DGYA4CPVP8B5yvexbp8c'//H34DSH0R@gMAIL.COM
const api_token='WpGqKUPcNtxiV7M9gmn8cYC1k5X2m719Q6ImUpaod8CSolhtYxZJ3KmYiiub'
const players_utils = require("./players_utils");
const teams_utils = require("./teams_utils");
const SEASON_ID = 18334;


/***************************** search For Player *******************************/
async function searchPlayerByName(player_name) {
    const playersByName = await axios.get(`${api_domain}/players/search/${player_name}`, {
      params: {
        //api_token: process.env.api_token,
        api_token: api_token,
        include: "team",
      },
    });
    let relevant_players = [];
    for (let i = 0; i < playersByName.data.data.length; i++){
        if(playersByName.data.data[i].team != null){
          if(playersByName.data.data[i].team.data.current_season_id == SEASON_ID &&
             playersByName.data.data[i].fullname.toLowerCase().includes(player_name.toLowerCase())){
            relevant_players.push(playersByName.data.data[i]);
          }
        }
    }
    if (relevant_players.length == 0) {
      return relevant_players;
    }
    let info_array = players_utils.extractRelevantPlayerDataForSearch(relevant_players);
    return info_array;
  }


/***************************** search For Team *******************************/

/**
 * This function is responsible for searching for a team by name
 * @param {*} searchQuery The name of the group we would like to search for
 * @returns team info by id
 */
async function searchForTeam(searchQuery) {
    const search_response = await axios.get(`${api_domain}/teams/search/${searchQuery}`, {
        params: {
            include: "venue",
            //api_token: process.env.api_token,
            api_token: api_token,
        },
    });
    let relevant_teams = [];
    for (let i = 0; i < search_response.data.data.length; i++){
        if(search_response.data.data[i].current_season_id == SEASON_ID){
            relevant_teams.push(search_response.data.data[i]);
        }
    }
    if (relevant_teams.length == 0)
        return relevant_teams;
    return teams_utils.extractRelevantTeamDataForSearch(relevant_teams);
}


/*******************************  exports  **********************************/

exports.searchForTeam = searchForTeam;
exports.searchPlayerByName = searchPlayerByName;