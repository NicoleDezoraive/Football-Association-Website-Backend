const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
//const api_token='OMfd2Pc31vLIQeolQqEjY4SlLPGkYhHFJ343AauoKbhe4BMDfZYOxWe407pT';
//const api_token='RSCxxlXzfL1NAjlkGFPkdEcBKUyKcdqJ6SxUlFl9CwGgp6W55qHKuRV0Jpxa';
//const api_token='e2N9saTRNM1Tm8Hj8Zj5nNLJJ8pHX0gIdr5kNPATmvxOM8fBUa7ai1VF94vH';
//const api_token='UdEygKk8iC2Nu5pGFQWzCo5Hw81zJDShiLPK0KJuxhmRohsc7HDTs2LOsrxn'//nwghbrns2@gmail.com
//const api_token='O7dcp5Z2O05s1dAnvRPAqcOv2DImwhnUUk80U0L1DGYA4CPVP8B5yvexbp8c'//H34DSH0R@gMAIL.COM
const api_token='WpGqKUPcNtxiV7M9gmn8cYC1k5X2m719Q6ImUpaod8CSolhtYxZJ3KmYiiub'
// const TEAM_ID = "85";
const LEAGUE_ID = '271';

/***************************** for full Team Info *******************************/


/**
 * A function which is responsible for returning a list of player IDs by the requested team
 * @param {*} team_id 
 * @returns returning a list of player IDs by the requested team that is in the league
 */
async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad,league",
      //api_token: process.env.api_token,
      api_token: api_token,
    },
  });
  if(team.data.data.league.data.id != LEAGUE_ID ){
    throw {status: 404, message: "It is not in current league" };
  }
  team.data.data.squad.data.map((team) =>{
      player_ids_list.push(team.player_id)
  });
  return player_ids_list;
}


/***************************** preview Player Info *******************************/


/**
 * A function which is responsible for previewing an array of players we receive
 * @param {*} players_ids_list Array of players' ID list
 * @returns Returns a list of player previews
 */
async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          //api_token: process.env.api_token,
          api_token: api_token,
          include: "team,stats",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

/**
 * A function which is responsible for extracting impressive relevant information from players with complete information
 * @param {*} players_info Array of players' ID list with full information
 * @returns Returns a list of previews of players who are in the league with the relevant details
 */
function extractRelevantPlayerData(players_info) {
  return players_info.map((player) => {
         const { player_id, fullname, image_path, position_id, team_id } = player.data.data;
          const {name}  = player.data.data.team.data;
          return {
            player_id: player_id,
            name: fullname,
            team_id: team_id,
            team_name: name,
            image: image_path,
            position: position_id,
      }

  });
}



/***************************** full Player Info *******************************/


/**
 * A function which is responsible for a full view of each player for an array of players you will receive.
 * @param {*} players_info Array of players' ID list
 * @returns Returns a list of full view of players
 */
async function getFullPlayerInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          //api_token: process.env.api_token,
          api_token: api_token,
          include: "team,stats",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData_fullPlayer(players_info);
  
}


/**
 * A function which is responsible for extracting impressive relevant information from players with complete information
 * @param {*} players_info players_info Array of players' ID list with full information
 * @returns Returns a list of full view of players who are in the league with the relevant details
 */
function extractRelevantPlayerData_fullPlayer(players_info) {
  return players_info.map((player) => {
        const { name } = player.data.data.team.data;
        const { player_id, fullname, image_path, position_id, common_name,birthdate, nationality, birthcountry, height, weight, team_id } = player.data.data;
        return {
            player_id: player_id,
            name: fullname,
            team_id: team_id,
            team_name: name,
            image: image_path,
            position: position_id,
            common_name: common_name,
            nationality: nationality,
            birthcountry: birthcountry,
            birthdate: birthdate,
            height: height,
            weight: weight,
        };
  });
}

function extractRelevantPlayerDataForSearch(players) {
  return players.map((player_info) => {
    const {player_id, fullname, image_path, position_id, team_id } = player_info;
    const { name } = player_info.team.data;
    return {
      player_id: player_id,
          name: fullname,
          team_id: team_id,
          team_name: name,
          image: image_path,
          position: position_id,
    };
  });
}


/*******************************  exports  **********************************/

exports.getPlayersInfo = getPlayersInfo;
exports.getFullPlayerInfo = getFullPlayerInfo;
exports.getPlayerIdsByTeam = getPlayerIdsByTeam;
exports.extractRelevantPlayerDataForSearch = extractRelevantPlayerDataForSearch;