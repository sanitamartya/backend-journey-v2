// User service — business logic layer
//
// KYUN: Ye layer "user create karna" ka matlab define karti hai.
// HTTP ke baare me nahi jaanti (req/res nahi) — isliye testable aur reusable
// (CLI, queue consumer, cron job — sab isse use kar sakte hain).
const { createUserSchema } = require("../schemas/userSchema");
const userRepository = require("../repositories/userRepository");
const logger = require("../lib/logger");

// ============================================================
// Custom Error Classes — domain errors
// ============================================================
// KYUN: Service HTTP status codes nahi jaanta. Wo domain errors throw karta hai.
// Controller in errors ko HTTP status codes me convert karega (400, 409).
// ============================================================

// ValidationError — request body invalid hai (controller 400 dega)
class ValidationError extends Error {
  constructor(details) {
    super("Validation failed");
    this.name = "ValidationError";
    this.details = details; // array of { field, message }
  }
}

// ConflictError — request valid hai, but current state se conflict (controller 409 dega)
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

// ============================================================
// createUser — naya user banao
// ============================================================
// INPUT:  body (raw request body — untrusted)
// OUTPUT: user object (created)
// THROWS: ValidationError (data galat), ConflictError (duplicate email)
//
// STEPS:
//   1. Validate (schema se)
//   2. Duplicate check (repository se)
//   3. Create (repository se)
// ============================================================
function createUser(body) {
  // STEP 1: Validate
  // ---------------
  // safeParse throw nahi karta — result object deta hai { success, data/error }
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    // Validation fail — domain error throw karo (controller 400 dega)
    logger.warn({ validationErrors: result.error.issues }, "validation failed");

    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."), // ['email'] -> "email"
      message: issue.message,
    }));

    throw new ValidationError(details);
  }

  // Validated + normalized data
  const { email, name } = result.data;

  // STEP 2: Duplicate check
  // -----------------------
  // Repository se puchho: "is email se user already hai?"
  const existingUser = userRepository.findByEmail(email);

  if (existingUser) {
    // Duplicate — domain error throw karo (controller 409 dega)
    logger.warn({ email }, "duplicate email attempted");
    throw new ConflictError("An account with this email already exists");
  }

  // STEP 3: Create
  // --------------
  // Repository se banao + store karo
  const user = userRepository.create({ email, name });

  logger.info({ userId: user.id, email }, "user created");

  return user;
}

// Export — controller isse import karega
module.exports = { createUser, ValidationError, ConflictError };
