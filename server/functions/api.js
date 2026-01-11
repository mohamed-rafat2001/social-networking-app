import serverless from "serverless-http";
import app from "../app.js";

// Export the serverless handler
export const handler = serverless(app);
