require('dotenv').config()
const express = require('express')
const app = express();
const cors = require("cors");
const connectDB = require('./db/conn')
const port = process.env.PORT
const userRoute = require("./routes/userRoute");
const articleRoute = require("./routes/articleRoute")
const commentRoute = require("./routes/commentRoute")
const cookieParser = require('cookie-parser')
app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);
app.use("/api/comments", commentRoute)
connectDB();
app.listen(port, () => console.log(`server is running on ${port}`))
