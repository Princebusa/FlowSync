import { Node, connectDB, disconnectDB } from "db/client";

async function seed() {
  console.log("Connecting to DB...");
  await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/n8n-clone");

  console.log("Clearing old nodes (if any)...");
  await Node.deleteMany({});

  const nodes = [
    { title: "timer", description: "Trigger workflow at an interval", type: "TRIGGER" },
    { title: "webhook", description: "Trigger on incoming HTTP", type: "TRIGGER" },
    { title: "schedule", description: "Trigger on cron schedule", type: "TRIGGER" },
    { title: "http-request", description: "Make an API call", type: "ACTION" },
    { title: "mail", description: "Send an email (SMTP)", type: "ACTION" },
  ];

  await Node.insertMany(nodes);
  console.log("✅ Successfully seeded the nodes collection!");
  await disconnectDB();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error(err);
  await disconnectDB();
  process.exit(1);
});
