const express=require('express');
const authMiddleware=require('../middleware/authMiddleware');
const createAccountController=require("../controllers/accountController");
const router= express.Router();
/**
 * -POST /api/account/
 * -create a new account
 * -prottected 
 */


router.post("/",authMiddleware.authMiddleware,createAccountController.createAccountController);

module.exports= router;