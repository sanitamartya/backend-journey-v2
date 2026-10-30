// Health routes — URL ko controller se jodta hai
//
// KYUN: Route layer sirf mapping (URL → handler). Logic controller me hai.
// app.js me mount: app.use('/health', healthRouter)
// Toh GET /health → healthRouter ka GET / → healthController.check
const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

// GET /health — server zinda hai?
router.get("/", healthController.check);

module.exports = router;
