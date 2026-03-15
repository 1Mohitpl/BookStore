const siginupRouter = require("./Sign-up");
const loginRouter = require("./login");
const alluser = require("./getUser");
const addBookrouter = require("./book");
const updatebookrouter = require("./book");
const deletbook = require("./book");
const getallbooks =require("./book");

module.exports = {
    siginupRouter, loginRouter, alluser, addBookrouter, addBookrouter,updatebookrouter, deletbook, getallbooks
}