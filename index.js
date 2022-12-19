require('dotenv').config()
const connectDB = require('./db/conn')
const express = require('express')
const app = express();
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const articleRoute = require("./routes/articleRoute")
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(cors());
app.use(express.json());
const port = process.env.PORT


app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);


connectDB();
app.listen(port, () => console.log(`server is running on ${port}`))
