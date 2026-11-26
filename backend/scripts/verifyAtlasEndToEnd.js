import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE = 'http://localhost:5001/api';

async function verify() {
  console.log('--- STEP 1: Backend Health Check ---');
  const healthRes = await axios.get(`${API_BASE}/health`);
  console.log('Health Response:', healthRes.data);

  console.log('\n--- STEP 2: Database Users Check ---');
  const atlasConn = await mongoose.createConnection(process.env.MONGO_URI).asPromise();
  const citizenInDb = await atlasConn.db.collection('users').findOne({ email: 'manshaverma1716@gmail.com' });
  console.log('Found citizen in Atlas:', {
    _id: citizenInDb._id,
    name: citizenInDb.name,
    email: citizenInDb.email,
    role: citizenInDb.role
  });

  const adminInDb = await atlasConn.db.collection('users').findOne({ role: 'admin' });
  console.log('Found admin in Atlas:', {
    _id: adminInDb._id,
    name: adminInDb.name,
    email: adminInDb.email,
    role: adminInDb.role
  });

  console.log('\n--- STEP 3: Admin API Login & Complaints Fetch ---');
  const adminLoginRes = await axios.post(`${API_BASE}/auth/admin/login`, {
    email: adminInDb.email,
    password: 'password123'
  });
  console.log('Admin login status:', adminLoginRes.status, 'Admin name:', adminLoginRes.data.user.name);
  const adminToken = adminLoginRes.data.token;

  // Fetch all complaints via Admin API
  const adminComplaintsRes = await axios.get(`${API_BASE}/complaints`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log(`Admin complaints retrieved from Atlas: ${adminComplaintsRes.data.count}`);
  console.log('Admin complaints list:');
  adminComplaintsRes.data.complaints.forEach(c => {
    console.log(`  - [${c.complaintId}] ${c.title} (${c.category}) | Status: ${c.status} | Citizen: ${c.citizenName || c.citizen?.name}`);
  });

  console.log('\n--- STEP 4: Citizen API Login & "My Reports" Fetch ---');
  const citizenLoginRes = await axios.post(`${API_BASE}/auth/login`, {
    email: 'manshaverma1716@gmail.com',
    password: 'password123'
  });
  console.log('Citizen login status:', citizenLoginRes.status, 'Citizen name:', citizenLoginRes.data.user.name);
  const citizenToken = citizenLoginRes.data.token;

  // Fetch citizen reports
  const myComplaintsRes = await axios.get(`${API_BASE}/complaints/my`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  console.log(`Citizen "My Reports" count: ${myComplaintsRes.data.count}`);
  myComplaintsRes.data.complaints.forEach(c => {
    console.log(`  - [${c.complaintId}] ${c.title} | Status: ${c.status} | Created: ${c.createdAt}`);
  });

  console.log('\n--- STEP 5: Create New Complaint & Verify Direct Persistence in Atlas ---');
  const newComplaintRes = await axios.post(
    `${API_BASE}/complaints`,
    {
      title: 'Water pipe leak near Sector 22 Market',
      description: 'Major water pipeline leak causing water logging and road flooding.',
      category: 'Water Supply',
      urgency: 'High',
      address: 'Main Market Road, Sector 22',
      landmark: 'Opposite Community Center',
      ward: 'Ward 8',
      pincode: '160022',
      latitude: 30.725,
      longitude: 76.775
    },
    { headers: { Authorization: `Bearer ${citizenToken}` } }
  );
  const createdTicket = newComplaintRes.data.complaint.complaintId;
  console.log('New complaint created via API:', createdTicket);

  // Verify that new complaint is stored directly in MongoDB Atlas
  const atlasNewComplaint = await atlasConn.db.collection('complaints').findOne({
    complaintId: createdTicket
  });
  console.log('Atlas Query Result for New Complaint:', {
    _id: atlasNewComplaint._id,
    complaintId: atlasNewComplaint.complaintId,
    title: atlasNewComplaint.title,
    status: atlasNewComplaint.status,
    category: atlasNewComplaint.category,
    citizen: atlasNewComplaint.citizen
  });

  console.log('\n--- STEP 6: Final Atlas Counts ---');
  const finalUsersCount = await atlasConn.db.collection('users').countDocuments();
  const finalComplaintsCount = await atlasConn.db.collection('complaints').countDocuments();
  const finalNotificationsCount = await atlasConn.db.collection('notifications').countDocuments();
  console.log(`MongoDB Atlas Total Users: ${finalUsersCount}`);
  console.log(`MongoDB Atlas Total Complaints: ${finalComplaintsCount}`);
  console.log(`MongoDB Atlas Total Notifications: ${finalNotificationsCount}`);

  await atlasConn.close();
  console.log('\n>>> ALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS! <<<');
}

verify().catch(err => {
  console.error('Verification error:', err.response?.data || err.message);
  process.exit(1);
});
