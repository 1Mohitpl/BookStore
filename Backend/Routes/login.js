const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const express = require("express");
const loginRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

loginRouter.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const presentUsername = await User.findOne({ username });
        if (!presentUsername) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, presentUsername.password);

        if (isMatch) {
            const authclaims = [
                { name: presentUsername.username },
                { address: presentUsername.address },
                { role: presentUsername.role }
            ];

            const token = jwt.sign(
    { 
        id: presentUsername._id,
        username: presentUsername.username,
        role: presentUsername.role 
    }, 
    process.env.private_key, 
    { expiresIn: "30d" }
);
            return res.status(200).json({
                id: presentUsername._id,
                address: presentUsername.address,
                role: presentUsername.role,
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

    } catch (err) {
        res.status(500).json({ message: `Error: ${err}` });
    }
});

module.exports = loginRouter;





// // get the user by emailId
// app.get("/email", async (req, res) => {
//   try{
//    const person = await User.find({email : req.body.email});
//    if(person.length === 0){
//        return res.status(404).send("User not found");
//    } else {
//        return res.json(person)  
//    }
    
//   } catch (err){
//      return  res.status(400).send(`message : ${err.message}`);
//   }
     

// })

// // Get the user by age

// app.get("/age", async (req, res) => {
     
//   const userbyAge = req.body.age;
//   try{
//     const user = await User.find({age : userbyAge});
//     if(userbyAge >=18){
//       return res.send(user);
//     } else {
//        res.status(404).send("User not found");
//     }
//   } catch(err){
//      res.status(400).send(`message : ${err}`);
//   }

// })

// // delete the user by userid

// app.delete("/delete", async (req, res) => {
//     const userId = req.body.userId;
//     try{
//        const user = await User.findByIdAndDelete(userId);
//        res.send("user delete successfully");
//     } catch (err) {
//         res.status(400).send(`message : ${err}`);
//     }
// })

// // update the user by the userid

// app.patch("/update/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
    
 
 
//   try {


//      const Allowed_Updates = [
//     "age", "gender", "Job_title", "password", "skills", "userId", "email"
//   ]


//   const isUpdateAllowed = Object.keys(data).every(k => Allowed_Updates.includes(k));

//   if(!isUpdateAllowed) {
//     throw new Error("update is not allowed");
//   }
//      await User.findByIdAndUpdate({_id : userId}, data,{
//       returnDocument :"after",
//         runValidators : true,
//      });
//      res.send("user update successfully");

//     } catch (err) {
//         res.status(400).send(` message :  ${err}`);
//     }
// })