var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

const authUtils = require("./utils/authUtils.js");

/**
 * This function allows a new user to register for the system
 * user need to input his personal details : user name, password, first name, last name, country, email, picture
 * (section  3 - Registration page)
 */
router.post("/Register", async (req, res, next) => {
  try {
    const users = await DButils.execQuery(
      "SELECT username FROM dbo.users"
    );
    
    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "username already exists" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;
    
    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, password, firstname, lastname, country, email, picture) VALUES
       ('${req.body.username}', '${hash_password}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.country}','${req.body.email}', '${req.body.picture}')`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});


/**
 * This function allow user to login by user name and password
 * (section  4 - Login page)
 */
router.post("/Login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});


/**
 * This function log out the user and remove his coockies by reset the session
 */
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.status(200).send("logout succeeded");
});

module.exports = router;
