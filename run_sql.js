const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:Cabho8-fewvys-vicdib@db.psmfiirnuwwhairgiohj.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    const sql = fs.readFileSync('/Users/bstar/.gemini/antigravity-ide/brain/0da9bd24-2ca4-4dc5-a7ad-3362499e9216/alter_schema.sql', 'utf8');
    await client.query(sql);
    console.log("SQL executed successfully");
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await client.end();
  }
}

run();
