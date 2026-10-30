// User data access layer — storage ka kaam sirf yahan
//
// KYUN: Service layer ko nahi pata data kahan store hota hai (Map? Postgres? Redis?).
// Wo bas "user save karo" bolta hai. Ye file "kaise save karna hai" handle karti hai.
//
// ABHI: In-memory Map (simple, setup zero). Aage: PostgreSQL (sirf ye file badlegi).
const crypto = require("node:crypto");

// ============================================================
// In-memory storage
// ============================================================
// Map<email, user> — email key hai (fast lookup, duplicate check O(1))
// KYUN email key: Duplicate check sabse common operation hai, O(1) chahiye
// AAGE: Ye Map hatega, Postgres queries aayengi (interface same rahega)
// ============================================================
const users = new Map();

// ============================================================
// findByEmail — email se user dhundo
// ============================================================
// INPUT:  email (string, already normalized by schema)
// OUTPUT: user object ya null (nahi mila toh)
// KYUN:   Duplicate check ke liye — "is email se user already hai?"
// ============================================================
function findByEmail(email) {
  return users.get(email) || null;
}

// ============================================================
// create — naya user banao aur store karo
// ============================================================
// INPUT:  { email, name } (validated data from schema)
// OUTPUT: complete user object (id, createdAt ke saath)
// KYUN:   Service validated data deta hai, repository complete user banata hai
//         (id generate, timestamp add — ye storage ki responsibility hai)
// ============================================================
function create({ email, name }) {
  const user = {
    id: crypto.randomUUID(), // unique, unguessable ID
    email, // already normalized (lowercase, trimmed)
    name, // already normalized (trimmed)
    createdAt: new Date().toISOString(), // ISO 8601 timestamp (UTC)
  };

  users.set(email, user); // store karo (email key, user value)
  return user; // complete user return karo
}

// Export — service layer in functions ko import karegi
module.exports = { findByEmail, create };
