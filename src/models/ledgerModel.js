const mongoose = require('mongoose');


const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"ledger must be associated account"],
        index:true,
        immutable:true,

    },
    amount:{
        type:Number,
        required:[true,"amount is needed for the ledger entry "],
        min:[0,"negitive amount is not acceptable "],
        immutable:true,
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"transation",
        required:[true,"required a transation "],
        index:true,
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["credit","debit"],
            message:"the type can be credit or debit "
        },
        required:true,
        immutable:true,
    },
},{
    timestamps:true,
});

function preventLedgerModification(){
    throw new Error("ledger can't be modified ")
};


ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('UpdateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);


const ledgerModel=mongoose.model("ledger",ledgerSchema);


module.exports=ledgerModel;