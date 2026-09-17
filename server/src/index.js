import "dotenv/config";
import app from "./app.js";

import { connectDB } from "./db/connectDB.js";

const port = process.env.PORT || 3000;

connectDB()
  .then((res) => {
    const info = res.connection;

    console.log("✅ MongoDB is connected successfully!");
    console.log(`👾 Host: ${info.host}`);

    app.on("error", (error) => {
      console.error("❌ Server error: ", error);
    });

    app.listen(port, () => {
      console.log(`🤖 Server is listening on port: ${port}\n`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed!");
    console.error(error);
  });
