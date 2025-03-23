require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const { connectionMongoDB} = require("./Connect/connect"); 
const newUser = require("./Routes/user");
app.use(express.json());

app.use("/user1",newUser);
//connections

connectionMongoDB("mongodb://127.0.0.1:27017/instgram-app-1");

app.get("/", (req, res) => {
    res.send("Hello, server is ready 🚀");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

