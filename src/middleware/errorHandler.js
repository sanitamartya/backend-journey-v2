// Global error handler — last middleware
//
// KYUN: Jo bhi unexpected error aaye (TypeError, DB fail, bug), use pakadta hai:
//   1. Log karta hai (structured, request ID ke saath)
//   2. Generic 500 response deta hai (koi internal detail leak nahi)
//   3. Server crash nahi hota
//
// KYUN 4 arguments: Express error handler ko 4 args se pehchanta hai:
//   (err, req, res, next). Normal middleware 3 args ka hota hai.
//
// KYUN sabse last: app.js me app.use(errorHandler) — saare routes ke baad.
const logger = require("../lib/logger");

// ============================================================
// errorHandler — unhandled errors ko 500 me convert karo
// ============================================================
// INPUT:  err (error object), req, res, next
// OUTPUT: 500 + { error: 'Internal Server Error' }
//
// KYUN req.log use karte hain: request ID attached hoti hai
// (pino-http middleware se), toh log me reqId aayegi — trace kar sakte ho.
// ============================================================
function errorHandler(err, req, res, next) {
  // Request-scoped logger (reqId ke saath), fallback global logger
  const log = req.log || logger;

  // Log karo — full error (stack trace included) — sirf server logs me, response me nahi
  log.error({ err }, "unhandled error");

  // Generic response — koi internal detail leak nahi
  // (stack trace, error message, DB details — client ko nahi dikhate)
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorHandler;
