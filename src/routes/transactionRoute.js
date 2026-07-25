const {Router}=require('express');
const authMiddleware=require('../middleware/authMiddleware');
const transactionController=require("../controllers/transactionController");
const transactionRouter= Router();
/**
 * -POST /api/transaction/
 * -create a new transaction
 */
transactionRouter.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);

/**
 * -POST /api/transaction/system/initial-funding
 * -Create initial funds transaction from system user 
 */

transactionRouter.post("/system/initial-funds",authMiddleware.authMiddleware,authMiddleware.authSystemUserMiddelware,transactionController.createInitialFundsTransaction);



module.exports= transactionRouter;