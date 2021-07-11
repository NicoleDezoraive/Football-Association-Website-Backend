var express = require("express");
var router = express.Router();
const search_utils = require("./utils/search_utils");


router.use((req, res, next) => {
  console.log("search routs");
  next();
});

/*******************************ROUTERS***************************************/
/**
 * This function returns player search results
 * (section  8 - Search page)
 */
 router.get("/queryPlayer/namePlayer/:searchQuery",async (req, res, next) => {
  try {
    //the param
    const search_Query = req.params.searchQuery;
    //check if queries params exist
    const results = await search_utils.searchPlayerByName(search_Query);
    if (results.length == 0)
      res.send({ status: 404, message: "No player found in current league in this position" });
    else{
      res.status(200).send(results);  
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});


/**
 * This function returns player search results by game position filter
 * (section  8 - Search page)
 */
router.get("/queryPlayer/namePlayer/:searchQuery/gamePosition/:num",async (req, res, next) => {
    try {
      //the params
      const search_Query = req.params.searchQuery;
      const num = req.params.num;
       //check if queries params exist
      const results = await search_utils.searchPlayerByName(search_Query);
      if (results.length == 0)
        res.send({ status: 404, message: "No player found in current league in this position" });
      else{
        let relevant_players = [];
        for (let i = 0; i < results.length; i++){
            if(results[i].position == parseInt(num))
              relevant_players.push(results[i]);
        }
        if (relevant_players.length == 0) {
          res.send({ status: 404, message: "No player found in current league in this position" });
        }
        else {
          res.status(200).send(relevant_players);
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

/**
 * This function returns player search results by filter of the team name
 * (section  8 - Search page)
 */
router.get("/queryPlayer/namePlayer/:searchQuery/groupName/:name", async (req, res, next) => {
  try {
    //the params
    const search_Query = req.params.searchQuery;
    const name = req.params.name;
    const results = await search_utils.searchPlayerByName(search_Query);
    if (results.length == 0)
      res.send({ status: 404, message: "No player found in current league in this team" });
    else{
      let relevant_players = [];
      for (let i = 0; i < results.length; i++){
          if(results[i].team_name.toLowerCase().includes(name.toLowerCase()))
            relevant_players.push(results[i]);
      }
      if (relevant_players.length == 0) {
        res.send({ status: 404, message: "No player found in current league in this team" });
      }
      else {
        res.status(200).send(relevant_players);
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// /**
//  * This function returns search results to the group
//  * (section  8 - Search page)
//  */
router.get("/queryTeam/nameTeam/:searchQuery",async (req, res, next) => {
     try {
      const search_Query = req.params.searchQuery;
      const results = await search_utils.searchForTeam(search_Query);
      if (results.length == 0) {
        res.send({ status: 404, message: "No team found in current league" });
      }
      else {
        res.status(200).send(results);
      } 
    } catch (error) {
      console.log(error);
      next(error);
    }
});

module.exports = router;
