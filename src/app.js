const express= require('express');
const cookieParser= require('cookie-parser');


const app= express();

app.use(express.json());
app.use(cookieParser());

/**
 * -required the routes
 */
const authRoutes= require('./routes/authRoute');
const accountRoutes= require('./routes/accountRoute');
const transactionRoutes=require('./routes/transactionRoute');



/**
 * -useing the routes required
 */
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactios",transactionRoutes);


module.exports= app;