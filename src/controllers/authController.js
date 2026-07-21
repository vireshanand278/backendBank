
const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');





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


module.exports={
    registerUser,
    loginUser
};  
