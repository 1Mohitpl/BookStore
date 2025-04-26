const User = require ("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function LogIn(req, res) {
    try{
      
        const {username, password} = req.body;  // take from input
        
        const presentUsername = await User.findOne({username});  // check present or not
        if(!presentUsername){
    
            res.status(400).json({message : "Invalid Credentials"});
        }
    
        await bcrypt.compare(password, presentUsername.password, (err, data) => {  // compare with exitperson's password
             
            if(data){
                const authclaims = [
                    {name : presentUsername.username},
                    {address :presentUsername.address}
                ];
    
                const token  = jwt.sign({authclaims}, "kitab123", {
                    expiresIn: "30d",
                });
                res.status(200).json(
                 {id: presentUsername._id,
                 address : presentUsername.address,
                 token : token,
                });
            } else {
                res.status(400).json({message : "Invalid Credentials"});
            }
        }) 
    
        } 
        
        catch (err) {
    
            res.status(500).json(`message of an error : ${err}`);
        }
}

module.exports = {LogIn}