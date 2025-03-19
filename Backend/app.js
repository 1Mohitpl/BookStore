require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const connect = require("./Connect/connect") 

app.get("/", (req, res) => {
    res.send("Hello, server is ready 🚀");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});