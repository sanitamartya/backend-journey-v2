// Express app — compose middleware + routes
//
// KYUN listen NAHI: app.js sirf app banata hai aur export karta hai.
// Testing me supertest(app) se HTTP test kar sakte ho bina server chalaye.
// server.js me app.listen() hota hai — sirf entry point.
const express = require("express");

const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const healthRouter = require("./routes/health");
const usersRouter = require("./routes/users");

const app = express();

// ============================================================
// 1. Security
// ============================================================
// Express apna naam response header me na bheje (X-Powered-By)
app.disable("x-powered-by");

// ============================================================
// 2. Request logging (sabse pehle — har request log ho)
// ============================================================
// Request ID + structured logs + sensitive headers hide
app.use(requestLogger);

// ============================================================
// 3. Body parser (routes se pehle — req.body chahiye)
// ============================================================
// JSON request body ko parse karke req.body me daalo
app.use(express.json());

// ============================================================
// 4. Routes
// ============================================================
// Root — sanity check (browser me khol ke dekh sakte ho)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health check — load balancer / k8s probe
app.use("/health", healthRouter);

// Users — POST /users
app.use("/users", usersRouter);

// ============================================================
// 5. Error handler (SABSE LAST — saare errors pakde)
// ============================================================
// Jo bhi route se next(err) aaye, yahan handle hoga → 500
app.use(errorHandler);

module.exports = app;
