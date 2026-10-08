// DB adapter router
// Switches between MOCK and REAL adapters based on environment variables.
// Usage:
//   - Set NEXT_PUBLIC_MOCK_MODE=true (or MOCK_MODE=true) to use the in-memory mock adapter
//   - Set to false to use the real adapter (Railway implementation placeholder)

import { mockDb } from "./db.mock";
import { realDb } from "./db.real";

const MOCK_MODE =
  process.env.NEXT_PUBLIC_MOCK_MODE === "true" ||
  process.env.MOCK_MODE === "true" ||
  // Default to true to make development easier if env is absent
  (process.env.NEXT_PUBLIC_MOCK_MODE === undefined &&
    process.env.MOCK_MODE === undefined);

export const db = MOCK_MODE ? mockDb : realDb;

if (MOCK_MODE) {
  console.info("[DB] Using MOCK MODE (in-memory data)");
} else {
  console.info("[DB] Using REAL MODE (Railway adapter placeholder)");
}