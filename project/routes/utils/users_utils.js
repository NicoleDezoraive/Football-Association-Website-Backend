const DButils = require("./DButils");


/**
 * This function add favorite game in the favorites list of the logged-in user 
 */
async function markGameAsFavorite(user_id, game_id) {
  await DButils.execQuery(
    `insert into dbo.favoriteGames values ('${user_id}',${game_id})`
  );
}
/**
 * This function return favorite games list of the logged-in user 
 */
async function getFavoriteGames(user_id) {
  const games_ids = await DButils.execQuery(
    `select game_id from dbo.favoriteGames where user_id='${user_id}'`
  );
  return games_ids;
}



/*******************************  exports  **********************************/
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;
