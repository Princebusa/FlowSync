import "dotenv/config";

export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/n8n-clone";
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:2000";
