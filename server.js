require('dotenv').config()
const connectDB = require('./db/conn')
const express = require('express')
const app = express();
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(cors());
app.use(express.json());
const port = process.env.PORT
app.use("/api/user", userRoute);


connectDB();
app.listen(port, () => console.log(`server is running on ${port}`))
