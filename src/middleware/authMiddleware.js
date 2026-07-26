const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const tokenBlackListModel=require("../models/blackListModel");



async function authMiddleware(req,res,next){
    const token=req.cookies.token||req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"unaouthirized acess ,the token is missing "
        })
    }
    const isBlacklisted=await tokenBlackListModel.findOne({
        token
    })

    if(isBlacklisted){
        return res.status.json(401)({
            message:"the token is black listed"
        })
    }


    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await userModel.findById(decoded.id);
        if(!user){
            res.status(401).json({
                message:"user not found",
            })
        }
        req.user=user;
        return next();

    }catch(error){
        return res.status(401).json({
            message:"unauthrized acess ,token is invalid "
        })
    }
}


async function authSystemUserMiddelware(req,res,next){
     const token=req.cookies.token||req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"unaouthirized acess ,the token is missing "
        })
    }
     const isBlacklisted=await tokenBlackListModel.findOne({
        token
    })

    if(isBlacklisted){
        return res.status.json(401)({
            message:"the token is black listed"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await userModel.findById(decoded.id).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbiden entry"
            });
        }

        req.user=user;
        return next();

    }catch(err){
        return res.status(401).json({
            message:"unauthrized acess ,token is invalid "
        })
    }
}


module.exports={
    authMiddleware,
    authSystemUserMiddelware,
}