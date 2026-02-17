const dotenv  = require("dotenv")
dotenv.config();

module.exports =  {
PORT : process.env.PORT,
database : process.env.data_base_url

}