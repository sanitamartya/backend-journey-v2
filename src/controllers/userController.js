// User controller — HTTP layer
//
// KYUN: Controller HTTP request ko service se jodta hai. Service business logic
// jaanta hai (validation, duplicate check), lekin HTTP nahi (status codes, req/res).
// Controller HTTP jaanta hai, lekin business logic nahi. Separation of concerns.
//
// FLOW:
//   req.body → service.createUser() → 201 + user JSON
//   ValidationError → 400 + details
//   ConflictError → 409 + message
//   Other error → next(err) → global error handler → 500
const {
  createUser,
  ValidationError,
  ConflictError,
} = require("../services/userService");

// ============================================================
// create — POST /users handler
// ============================================================
// INPUT:  req (body me email, name), res, next
// OUTPUT: 201 + user JSON (success)
//         400 + details (validation error)
//         409 + message (duplicate)
//         next(err) (unexpected — global handler 500 dega)
// ============================================================
async function create(req, res, next) {
  try {
    // Service call — business logic wahan hai
    const user = createUser(req.body);

    // Success — 201 Created + user JSON
    return res.status(201).json(user);
  } catch (err) {
    // ValidationError — request body galat hai → 400
    if (err instanceof ValidationError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.details,
      });
    }

    // ConflictError — duplicate email → 409
    if (err instanceof ConflictError) {
      return res.status(409).json({
        error: "Conflict",
        message: err.message,
      });
    }

    // Unexpected error — global error handler ko do → 500
    // (server crash nahi hoga, error log hoga, generic 500 response jayega)
    return next(err);
  }
}

// Export — routes isse import karengi
module.exports = { create };
