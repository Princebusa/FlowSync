import dotenv from "dotenv";
import { WorkFlow, Execution, connectDB, disconnectDB } from "./packages/db/index.js";

dotenv.config();

async function cleanup() {
  try {
    await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/n8n-clone");
    console.log("Connected to MongoDB for cleanup...");

    const delExec = await Execution.deleteMany({ status: { $in: ["PENDING", "RUNNING"] } });
    console.log(`Deleted ${delExec.deletedCount} PENDING/RUNNING executions.`);

    const updWf = await WorkFlow.updateMany({}, { isRunning: false });
    console.log(`Reset ${updWf.modifiedCount} workflows to isRunning: false.`);

    await disconnectDB();
    console.log("Cleanup complete!");
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
}

cleanup();