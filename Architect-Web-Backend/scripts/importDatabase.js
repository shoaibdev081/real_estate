const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Target URI: pass via CLI argument or environment variable
// Example: node scripts/importDatabase.js "mongodb+srv://user:pass@cluster0.../architect-db"
const targetUri = process.argv[2] || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/architect-db';
const backupFile = path.join(__dirname, '../data-backup.json');

async function importAll() {
  if (!fs.existsSync(backupFile)) {
    console.error(`Backup file not found at: ${backupFile}`);
    process.exit(1);
  }

  console.log(`Connecting to target MongoDB: ${targetUri}`);
  await mongoose.connect(targetUri);
  console.log('Connected successfully!');

  const raw = fs.readFileSync(backupFile, 'utf8');
  const backup = JSON.parse(raw);

  for (const [colName, docs] of Object.entries(backup)) {
    if (!Array.isArray(docs) || docs.length === 0) {
      console.log(`- Skipping "${colName}" (empty)`);
      continue;
    }

    const col = mongoose.connection.db.collection(colName);
    // Clear existing docs in collection to prevent duplicate keys
    await col.deleteMany({});
    
    // Convert date strings back to Date objects where applicable
    const processedDocs = docs.map((doc) => {
      const cleanDoc = { ...doc };
      for (const [k, v] of Object.entries(cleanDoc)) {
        if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
          cleanDoc[k] = new Date(v);
        }
      }
      return cleanDoc;
    });

    await col.insertMany(processedDocs);
    console.log(`✓ Restored ${processedDocs.length} documents into "${colName}"`);
  }

  console.log('\nAll collections successfully imported and restored!');
  await mongoose.disconnect();
}

importAll().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});

