const app = require("express")();
var express = require("express");
const server = require("http").Server(app);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");
const port = process.env.PORT || 3000;
connectDb();

nextApp.prepare().then(() => {
  app.use(express.json());
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/auth", require("./api/auth"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/profile", require("./api/profile"));

  app.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Express server running on ${port}`);
  });
});
