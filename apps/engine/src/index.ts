import { connectDB } from "db/client";
import { startWorker } from "./worker";
import { MONGO_URI } from "./config";

async function main() {
  console.log("Starting engine...");
  await connectDB(MONGO_URI);
  await startWorker();
}

main().catch((err) => {
  console.error("Engine crashed:", err);
  process.exit(1);
});
