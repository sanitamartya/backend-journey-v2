// Request logging middleware: request ID + structured logs + sensitive headers hide
const pinoHttp = require("pino-http");
const crypto = require("node:crypto");
const logger = require("../lib/logger");

// Options alag define — readable, reusable
const options = {
  logger,

  // Request ID: client ka X-Request-ID use karo, warna generate
  genReqId: (req) => {
    return req.headers["x-request-id"] || crypto.randomUUID();
  },

  // Status code ke hisaab se log level
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  // Success message readable
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },

  // Sirf safe headers log karo — Authorization, Cookie kabhi nahi
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        "content-type": req.headers["content-type"],
        "user-agent": req.headers["user-agent"],
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
};

// Middleware banao options se
const requestLogger = pinoHttp(options);

module.exports = requestLogger;
