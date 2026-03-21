require('dotenv').config();
const express = require("express");

const app = express();
const {serverConfig} = require("./Connect");
const {connectDB} = require("./Connect")
const newUser = require("./Routes/user");
const { siginupRouter, loginRouter, alluser, addBookrouter, updatebookrouter, deletbook, getallbooks } = require("./Routes");
const bookRoutes = require("./Routes/book");
const cartRoutes = require("./Routes/Cart");
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, server is ready 🚀");
});


app.use("/", siginupRouter);
app.use("/", loginRouter);
app.use("/", alluser);
app.use("/", bookRoutes);
app.use("/", cartRoutes);
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





