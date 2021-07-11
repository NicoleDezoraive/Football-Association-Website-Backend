const DButils = require("./DButils");

/**
 * This function returns all user names that save in DB
 * @returns all user names that save in DB
 */
async function selectUsernames() {
    let users = (
        await DButils.execQuery(`SELECT * FROM dbo.users`)
    );
    return (users);
}

/**
 * This function add new user to DB
 * @param {*} username 
 * @param {*} password 
 * @param {*} firstname 
 * @param {*} lastname 
 * @param {*} country 
 * @param {*} email 
 * @param {*} urlPic 
 */
async function addUser(username, password, firstname, lastname, country, email, urlPic) {
    await DButils.execQuery(
        `INSERT INTO dbo.users (user_id, username, password, firstname, lastname, country, email, urlPic) 
        VALUES (default, '${username}', '${password}', '${firstname}', '${lastname}', '${country}', '${email}', '${urlPic}');`)  

}

/**
 * This function return all details about specific user from DB
 * @param {*} username 
 * @returns all details about specific user from DB
 */
async function findUser(username) {
    let user = (
        await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = '${username}'`)
    )[0];
    return (user);
}

/**
 * This function ckeck if email address input invalid , return boolean 
 * @param {*} email 
 * @returns 
 */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


/*******************************  exports  **********************************/
exports.selectUsernames = selectUsernames;
exports.addUser = addUser;
exports.findUser = findUser;
exports.validateEmail = validateEmail;
