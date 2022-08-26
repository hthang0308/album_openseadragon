const express = require("express");

const userRouter = require("./user");
const albumRouter = require("./album");
const shareRouter = require("./share");
const routes = (app) => {
  // for form
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  // for axios
  app.use(express.json());
  app.use("/api/user", userRouter);
  app.use("/api/album", albumRouter);
  app.use("/api/share", shareRouter);
};

module.exports = routes;
