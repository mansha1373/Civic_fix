import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const LOCAL_URI = 'mongodb://127.0.0.1:15268/test';
const ATLAS_URI = process.env.MONGO_URI;

if (!ATLAS_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

async function migrate() {
  console.log('Connecting to local source MongoDB at:', LOCAL_URI);
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('Local source connected successfully.');

  console.log('Connecting to target MongoDB Atlas at:', ATLAS_URI.replace(/:([^:@]+)@/, ':****@'));
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('Target MongoDB Atlas connected successfully.');

  const localDb = localConn.db;
  const atlasDb = atlasConn.db;

  // 1. Migrate Users
  const localUsers = await localDb.collection('users').find({}).toArray();
  console.log(`Found ${localUsers.length} users in local database.`);
  for (const u of localUsers) {
    const existing = await atlasDb.collection('users').findOne({ email: u.email });
    if (!existing) {
      console.log(`Migrating user: ${u.email} (${u.name}, role: ${u.role})`);
      await atlasDb.collection('users').insertOne(u);
    } else {
      console.log(`User already exists in Atlas: ${u.email}`);
    }
  }

  // Also ensure mansha1716@gmail.com is supported if user logs in with it
  // Let's check if manshaverma1716@gmail.com exists
  const targetUser = await atlasDb.collection('users').findOne({ email: 'manshaverma1716@gmail.com' });
  if (targetUser) {
    const aliasCheck = await atlasDb.collection('users').findOne({ email: 'mansha1716@gmail.com' });
    if (!aliasCheck) {
      console.log('Creating convenience alias for mansha1716@gmail.com with same password and ID reference...');
      const aliasDoc = { ...targetUser, _id: new mongoose.Types.ObjectId(), email: 'mansha1716@gmail.com' };
      await atlasDb.collection('users').insertOne(aliasDoc);
      console.log('Alias mansha1716@gmail.com created in Atlas.');
    }
  }

  // 2. Migrate Complaints
  const localComplaints = await localDb.collection('complaints').find({}).toArray();
  console.log(`Found ${localComplaints.length} complaints in local database.`);
  for (const c of localComplaints) {
    const existing = await atlasDb.collection('complaints').findOne({ complaintId: c.complaintId });
    if (!existing) {
      console.log(`Migrating complaint: ${c.complaintId} - "${c.title}" [Status: ${c.status}]`);
      await atlasDb.collection('complaints').insertOne(c);
    } else {
      console.log(`Complaint already exists in Atlas: ${c.complaintId}`);
    }
  }

  // 3. Migrate Notifications
  const localNotifications = await localDb.collection('notifications').find({}).toArray();
  console.log(`Found ${localNotifications.length} notifications in local database.`);
  for (const n of localNotifications) {
    const existing = await atlasDb.collection('notifications').findOne({ _id: n._id });
    if (!existing) {
      await atlasDb.collection('notifications').insertOne(n);
    }
  }

  // Check counts in Atlas
  const atlasUsersCount = await atlasDb.collection('users').countDocuments();
  const atlasComplaintsCount = await atlasDb.collection('complaints').countDocuments();
  const atlasNotificationsCount = await atlasDb.collection('notifications').countDocuments();

  console.log('\n--- MIGRATION VERIFICATION IN MONGODB ATLAS ---');
  console.log(`Users in Atlas: ${atlasUsersCount}`);
  console.log(`Complaints in Atlas: ${atlasComplaintsCount}`);
  console.log(`Notifications in Atlas: ${atlasNotificationsCount}`);

  const sampleComplaints = await atlasDb.collection('complaints').find({}, { projection: { complaintId: 1, title: 1, status: 1 } }).toArray();
  console.log('Atlas Complaints:', sampleComplaints);

  await localConn.close();
  await atlasConn.close();
  console.log('Migration completed successfully.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
