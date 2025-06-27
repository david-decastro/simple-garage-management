import mongoose from "mongoose";

async function initMongodb(uri) {
  try {
    mongoose.set("strictQuery", false);
    const msg = await mongoose.connect(uri);
    console.log("connected to database");
    return msg;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export { initMongodb };
