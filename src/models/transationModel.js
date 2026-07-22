const mongoose = require('mongoose');


const transationSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"needed fromaccount"],
        index:true,

    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"needed toAccount"],
        index:true,
    },
    status:{
        type:String,
        enum:{
            values:["pending","complete","failed","reversed"],
            message:"the status must be pending ,complete ,failed ,or reversed "
        },
        default:"pending",
    },
    amount:{
        type:Number,
        required:[true,"amount is needed for the transation "],
        min:[0,"negitive amount is not acceptable "]
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotencyKEy is required for creating the transation "],
        index:true,
        unique:true,
    }

},{
    timestamps:true,
})

const transationModel=mongoose.model("transation",transationSchema);


module.exports=transationModel;