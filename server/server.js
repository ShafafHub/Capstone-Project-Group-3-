import app from "./app.js";
import { dbPromise } from "./src/config/db.js";
import { initDb } from "./src/db/initDb.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const db = await dbPromise;

    await initDb(db);

    // --- Start server ---
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();