const jwt = require('jsonwebtoken');
const Collection = require("../models/signup");

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Collection.findOne({_id:verifyUser._id});
        next();

    }
    catch{
        res.status(401).send(error);
    }
}

module.exports = auth;