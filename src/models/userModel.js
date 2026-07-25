const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
    "email":{
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']   //regex for email validation

    },
    name:{
        type: String,
        required: [true, 'Name is required'],
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,  //to hide password when fetching user data

    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false,
    }
},{
    timestamps: true,  //to automatically add createdAt and updatedAt fields
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return 
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return 
});

//a method for the compairing the password creted by us just for the userSchema
userSchema.methods.comparePassword = async function(candidatePassword){

    
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;