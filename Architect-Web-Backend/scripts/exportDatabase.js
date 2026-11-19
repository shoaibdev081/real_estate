const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/architect-db';
const outputFile = path.join(__dirname, '../data-backup.json');

async function exportAll() {
  console.log(`Connecting to MongoDB: ${MONGO_URI}`);
  await mongoose.connect(MONGO_URI);
  console.log('Connected successfully!');

  const collections = await mongoose.connection.db.listCollections().toArray();
  const backup = {};

  for (const col of collections) {
    const name = col.name;
    // Skip system collections
    if (name.startsWith('system.')) continue;
    const docs = await mongoose.connection.db.collection(name).find({}).toArray();
    backup[name] = docs;
    console.log(`✓ Exported ${docs.length} documents from "${name}"`);
  }

  fs.writeFileSync(outputFile, JSON.stringify(backup, null, 2), 'utf8');
  console.log(`\nAll collections exported successfully to: ${outputFile}`);
  await mongoose.disconnect();
}

exportAll().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});

