const express = require("express");
require('dotenv').config();
const app = express();
const {serverConfig} = require("./Connect");
const {connectDB} = require("./Connect")
const newUser = require("./Routes/user");
app.use(express.json());

app.use("/user1",newUser);

//connections
connectDB()
    .then(() => {
        console.log("database connection established");
        app.listen(serverConfig.PORT, () => {
            console.log(`Server is running on port ${serverConfig.PORT}`);
        });
    })
    .catch ((err) => {
        console.log(`error : ${err}`);
    })

app.get("/", (req, res) => {
    res.send("Hello, server is ready 🚀");
});




