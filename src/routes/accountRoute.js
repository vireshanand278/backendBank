const express=require('express');
const authMiddleware=require('../middleware/authMiddleware');
const accountController=require("../controllers/accountController");
const router= express.Router();
/**
 * -POST /api/account/
 * -create a new account
 * -prottected 
 */
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController);

/**
 * -GET /api/accounts/
 * -Get the all the account that the the user has logged in
 * -Prtected route
 */
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController);

/**
 * -GET /api/accounts/balance/:accountId
 * -
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController);


module.exports= router;