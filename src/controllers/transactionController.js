const accountModel=require("../models/accountModel");
const ledgerModel=require("../models/ledgerModel");
const transactionModel=require("../models/transactionModel");
const emailServices=require("../services/emailServices");
const mongoose=require("mongoose");


/**
 * -10 step varification for the transaction flow
 * 
 * 1.validation of the request
 * 2.validaton of the idempotencyKey
 * 3.check the account status 
 * 4.derive the sender balance from the ledger 
 * 5.create transation (pending)
 * 6.create the debit ledger
 * 7.create the credit ledger
 * 8.mark the transaction status (compeated)
 * 9.commite mongodb session 
 * 10.send email notification 
 */


async function createTransaction(req,res){

    //1.validate request
    const {fromAccount,toAccounten,amount,idempotencyKey}=req.body;
    if(!fromAccount||!toAccounten||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"somthing is missing "
        })
    }

    const fromUserAccount=await accountModel.findOne({_id:fromAccount,});
    const toUserAccount=await accountModel.findOne({_id:toAccount,});

    if(!toUserAccount || !fromUserAccount){
        return res.status(404).json({
            message:"invalide from account or to account"
        });
    };


    //2.validate idempotencyKey
    const isTransactionAlredyExists=await transactionModel.findOne({idempotencyKey:idempotencyKey});
    if(isTransactionAlredyExists){
        if(isTransactionAlredyExists.status==="compleate"){
            return res.status(200).json({
                message:"the transaction is alredy complete",
                transaction:isTransactionAlredyExists
            });
        }

        if(isTransactionAlredyExists.status==="pending"){
           return res.status(200).json({
                message:"the transaction is pending"
            })
        }

        if(isTransactionAlredyExists.status==="failed"){
        return res.status(500).json({
            message:"transaction is failed "
        })
        }

        if(isTransactionAlredyExists.status==="reversed"){
           return  res.status(500).json({
                message:"the transaction was reversed try later "
            })
        }

    }
    //3.check account status
        if(fromUserAccount.status!="active" || toUserAccount.status!="active"){
            res.status(400).json({
                message:"both the account must be active"
            })
        }

    //4. derive the senders value from the ledger 

    const balance=await fromUserAccount.getBalance()    
    
    if(balance<amount){
        res.status(400).json({
            message:`the balance is insuffecient Balance:( ${balance} )  amount:(${ amount })`
        })
    }
let transaction;
    try{

    

    //5.create transaction (pending)
        const session=await mongoose.startSession();
        session.startTransaction()

        const transaction=(await  transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"pending",

        }],{session}));


        //6.create the debit ledger
        const debitLedger=await ledgerModel.create([{
            account:fromAccount,
            aamount:amount,
            transaction:transaction._id,
            type:"debit"

        }],{session});

        await (()=>{
            return new Promise((resolve)=>setTimeout(resolve,25*1000));
        })

        //7.create the credit ledger
        const creditLedger=await ledgerModel.create([{
            account:toAccount,
            aamount:amount,
            transaction:transaction._id,
            type:"credit"

        }],{session});
        
        //8.mark the status (complete)
        await transactionModel.findOneAndUpdate(
            {_id:transaction._id},
            {status:"completed"},
            {session}
        )

        //9.mongoose session termination
        await session.commitTransaction()
        session.endSession();
    }catch(error){
        return res.status(400).json({
            message:"Transaction is pending  due to error,Please try after some time  "
        })
    }

        //10.send the email
        await emailServices.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount);
        return res.status(201).json({
            message:"Transaction compleated sucessfullt",
            transaction:transaction
        })
        
}

async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body;
    if(!toAccount ||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"toAccount,amountand idempotency key are needed "
        })
    }

    const toUserAccount=await accountModel.findOne({
       _id:toAccount, 
    })
    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid To account  "
        })
    }

    const fromUserAccount=await accountModel.findOne({
        user:req.user._id,
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }

    const session=await mongoose.startSession()
    session.startTransaction()

    const transaction=new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"pending"

    })

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"debit",
    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"credit"
    }],{session})
    
    transaction.status="completed"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"initial funds transaction compleated successfully",
        transaction:transaction,
    })
    
}

module.exports={
    createTransaction,
    createInitialFundsTransaction,

}
