import app from "./app.js";
import db from "./src/config/knex.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    //  Check database connection
    await db.raw('select 1+1 as result');

    console.log(" Database connected");

    //  Attach db to app
    app.locals.db = db;

    //  Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
};

start();