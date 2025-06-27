import cron from "node-cron";
import { cleanupOldTempFiles } from "./services/FileService.js";

cron.schedule("0 2 * * *", async () => {
  console.log("*--- Starting to remove old files from temp folder ---*");
  cleanupOldTempFiles();
  console.log("*--- Finished to remove old files from temp folder ---*");
});
