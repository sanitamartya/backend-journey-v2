// User routes — URL ko controller se jodta hai
//
// KYUN: Route layer sirf mapping karta hai (URL → handler). Koi logic nahi.
// Controller me logic hai, service me business logic, repository me storage.
//
// KYUN Router: express.Router() ek mini-app hai — apne routes, apne middleware.
// app.js me mount karte hain: app.use('/users', usersRouter)
// Toh POST /users → usersRouter ka POST / → userController.create
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// POST /users — naya user banao
// (app.js me mount hone ke baad, ye POST /users ban jayega)
router.post("/", userController.create);

module.exports = router;
