import express from "express";
import logger from "morgan";
import router from "./routers/router.js";
import dotenv from "dotenv";
import { initMongodb } from "./config/mongodb-init.js";

import "./cron-tasks.js";

dotenv.config();

const PRODUCTION_ENV = process.env.NODE_ENV === "production";

function initApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(logger(PRODUCTION_ENV ? "tiny" : "dev"));

  const port = process.env.PORT || 5000;

  if (PRODUCTION_ENV) {
    const staticRoute = "dist";
    app.use(express.static(staticRoute));
  }

  app.use("/api", router);

  app.listen(port, () => {
    console.log(`garage listening at http://localhost:${port}`);
  });
}

const mongoUri = `mongodb://${process.env.DB_HOSTNAME || "127.0.0.1"}:${process.env.DB_PORT || 27017}/${process.env.DB_SCHEMA || "simple_garage"}`;
console.log("Conecting to db... " + mongoUri);
initMongodb(mongoUri).then(() => {
  initApp();
});
