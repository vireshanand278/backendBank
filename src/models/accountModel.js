const mongoose = require('mongoose');
const ledgerModel=require('../models/ledgerModel');

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,"account must belong to a user"],
        index: true   // to make the searching faster
    },
    status:{
        enum: {
            
            values: ['active', 'frozen','inactive'],
            
            message: 'Status must be one of active, frozen, or inactive',
        },
        type:String,
        default:'active',
    },
    corrency:{
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR',
    }

},{
    timestamps: true,  //to automatically add createdAt and updatedAt fields
});

accountSchema.index({ user: 1, status: 1 }); // Create a compound index on user and status fields


accountSchema.methods.getBalance=async function(){
    const balanceData=await ledgerModel.aggregate([
        {$match : { account : this._id } },
        {$group:{_id:null,totalDebit:{$sum:{$cond:[{$eq:["$type","debit"]},"$amount,0"]}},totalCredit:{$sum:{$cond:[{$eq:["$type","credit"]},"amount,0"]}}}},
        {$project:{_id:0,balance:{$subtract:["$totalCredit","$totalDebit"]}}}
    ])

    if(balanceData.length===0){
        return 0;
    }

    return balanceData[0].balance
}                                                           // returns the total balance in this account 

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;