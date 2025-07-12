const pg = require("pg");
const logger = require("../../middleware/winston");

// Optional: log non-sensitive config for debugging
logger.info("PostgreSQL DB config", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: 5432,
});

const db_config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "127.0.0.1",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 10,
};

let db_connection;

function startConnection(attempt = 1) {
  if (attempt > 3) {
    logger.error("PostgreSQL failed after 3 attempts. Aborting.");
    return;
  }

  pg.types.setTypeParser(1082, (value) => value); // date type parser

  db_connection = new pg.Pool(db_config);

  db_connection.connect((err, client, release) => {
    if (err) {
      logger.error(`❌ PostgreSQL Connection Failed (Attempt ${attempt}): ${err.message}`);
      setTimeout(() => startConnection(attempt + 1), 2000); // retry after 2s
    } else {
      logger.info("✅ PostgreSQL Connected");
      release(); // release the connection back to the pool
    }
  });

  db_connection.on("error", (err) => {
    logger.error(`💥 PostgreSQL connection pool error: ${err.message}`);
    // Do not recursively reconnect here — could cause infinite retry loop
  });
}

startConnection();

module.exports = db_connection;
