
const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const services=require('../services/emailServices');
const tokenBlackListModel=require("../models/blackListModel");




/**
 * - user register controller
 * -POST /api/auth/register 
 */
async function registerUser(req,res){
    const {email,name,password}=req.body;


    const isExistingUser= await userModel.findOne({email});
    if(isExistingUser){
        return res.status(422).json({message: 'Email already exists',status: 'failed'});
    }


    const newUser= new userModel({
        email,
        name,
        password
    });
    await newUser.save();
    


    const token= jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '3d'});

    res.cookie('token', token);
    res.status(201).json({
        user:{
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name
        },
        token,
        message: 'User registered successfully',
        status: 'success'
    });
    

        try {
                await services.sendRegistrationEmail(email, name);
                console.log("Registration email sent successfully");
            } catch (error) {
                console.error("Failed to send registration email:", error);
        }   

} 

        

  

/**
 * - user login controller
 * -POST /api/auth/login 
 */
async function loginUser(req,res){
    const {email,password}=req.body;

    const user= await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(421).json({message: 'Email  is invalid  ',status: 'failed'});

    }

    const isValidPassword=await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(421).json({message: ' Password is invalid  ',status: 'failed'});
    }

    const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '3d'});

    res.cookie('token', token);
    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token,
        message: 'User logged in successfully',
        status: 'success'
    });

    
}




/**
 * - user logout controller
 * -POST /api/auth/logout 
 */
async function logoutUser(req,res){
    const token =req.cookies.token||req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(200).json({
            message:"User loged ot susessfully"
        })

    }
    await tokenBlackListModel.create({
        token:token
    })
    res.clearCookie("token")
    res.status(200).json({
            message:"User loged ot susessfully"
        })

}

module.exports={
    registerUser,
    loginUser,
    logoutUser,
};  
