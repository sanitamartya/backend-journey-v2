// User validation schemas — Zod contracts for request bodies
// Ye file define karti hai ki "valid user data" kaisa dikhta hai
const { z } = require("zod");

// ============================================================
// createUserSchema — POST /users ke request body ka contract
// ============================================================
//
// KYUN: Jab bhi koi naya user create karna ho, uska data is shape me
// hona chahiye. Agar nahi hai, toh 400 error milega (service layer me).
//
// KYA KARTA HAI: validate karta hai + normalize karta hai (trim, lowercase).
// Extra fields automatically strip ho jaate hain (security).
// ============================================================
const createUserSchema = z.object({
  // EMAIL FIELD
  // -----------
  // Kyun: User ki unique identity. Login, password reset, notifications — sab isse.
  // Rules:
  //   1. String hona chahiye (number/object/array nahi)
  //   2. Valid email format (xxx@yyy.zzz)
  //   3. Trim karo (leading/trailing spaces hatao — users copy-paste karte hain)
  //   4. Lowercase karo (emails case-insensitive hote hain — Test@X.com == test@x.com)
  //      Lowercase NA kiya toh duplicate detection fail hoga!
  email: z
    .string({ message: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Email must be a valid email address"),

  // NAME FIELD
  // ----------
  // Kyun: Display name, emails me greeting, reports me.
  // Rules:
  //   1. String hona chahiye
  //   2. Trim karo (leading/trailing spaces hatao)
  //   3. Min 1 char (khaali nahi, spaces-only bhi nahi — trim ke baad)
  //   4. Max 100 chars (DoS prevention — koi 1MB name na bhej de)
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be at most 100 characters"),
});

// Export — service layer isse import karegi validation ke liye
module.exports = { createUserSchema };
