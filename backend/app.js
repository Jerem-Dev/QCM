const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const qcmRouter = require("./routes/qcm");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/qcms", qcmRouter);

module.exports = app;
