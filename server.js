// Entry point — sirf app start karna
//
// KYUN: app.js me app composed hai (middleware + routes), but listen nahi.
// Yahan listen karte hain. Testing me app.js directly use hota hai (listen ke bina).
//
// server.js = ignition key. app.js = engine. Bas start karna hai.
const app = require("./src/app");
const env = require("./src/config/env");
const logger = require("./src/lib/logger");

// Server start karo — config se port
app.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT, env: env.NODE_ENV },
    `server started on http://localhost:${env.PORT}`,
  );
});
