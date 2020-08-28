const { PORT = 9090 } = process.env;
const express = require("express");
const cors = require("cors");

const apiRouter = require("./routers/api.router");

const app = express();
app.use(cors());
app.use("/api", apiRouter);

app.use(express.json());

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app;
