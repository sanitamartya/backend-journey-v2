// Entry point: sirf config load karke verify. Baad me app.listen() yahan aayega.
const env = require("./src/config/env");

console.log(
  `Bootstrapping with env: ${env.NODE_ENV}, port: ${env.PORT}, logLevel: ${env.LOG_LEVEL}`,
);
