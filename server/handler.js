import serverless from "serverless-http";
import app from "./app.js";

// Wrap the Express app for Netlify/Serverless
export const handler = serverless(app);
