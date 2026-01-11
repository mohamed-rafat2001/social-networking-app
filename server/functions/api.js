import serverless from "serverless-http";
import { app } from "../app.js";

// Export the serverless handler
// We use the named import to ensure serverless-http receives the actual Express function
// instead of a wrapped object that might cause "Unsupported framework" errors.
export const handler = serverless(app);
