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


/**
 * -useing the routes required
 */
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);



module.exports= app;