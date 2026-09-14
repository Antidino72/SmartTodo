const {Pool} = require("pg");
require("dotenv").config();

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});
async function migrate() {
  try {
    const filePath = './cli/create_table.sql';
    const sql = require('fs').readFileSync(filePath, 'utf8');
    await database.query(sql);
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await database.end();
  }
}

migrate();