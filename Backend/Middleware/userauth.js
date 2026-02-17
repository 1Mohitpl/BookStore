const jwt = require("jsonwebtoken");


const authentication  = (req, res, next) => {
   
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null) {
            return res.status(401).JSON({ message : "Authorization token is required"});
    }

    jwt.verify(token, process.env.private_key, (user, err) => {
        if(err) {
            return res.status.(403).JSON(err);
        } else {

            req.user = user;
            next();
        }
    })
}   

module.exports = {authentication};