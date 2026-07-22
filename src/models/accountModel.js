const mongoose = require('mongoose');


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


const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;