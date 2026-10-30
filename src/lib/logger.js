// Pino logger — poore app me shared
const pino = require("pino");
const env = require("../config/env");

// Dev me pretty output (readable), production me raw JSON
let loggerConfig = {
  level: env.LOG_LEVEL,
};

if (env.NODE_ENV !== "production") {
  loggerConfig.transport = {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "SYS:standard" },
  };
}

const logger = pino(loggerConfig);

module.exports = logger;
