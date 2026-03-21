import mongoose from 'mongoose';
import config from '../config/env.js';
import User from '../models/User.js';
import ChannelSettings from '../models/ChannelSettings.js';

async function seed() {
  if (!config.mongoUri) {
    console.log('❌ MONGODB_URI not set. Cannot seed.');
    console.log('   Mock mode credentials: admin@cx360.com / Admin@CX360#1');
    process.exit(1);
  }

  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB');

  // Seed users
  const users = [
    { name: 'CX360 Admin', email: 'admin@cx360.com', password: 'Admin@CX360#1', role: 'admin' },
    { name: 'CX360 Manager', email: 'manager@cx360.com', password: 'Manager@CX360#1', role: 'manager' },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`User ${u.email} already exists — skipped`);
    } else {
      await User.create(u);
      console.log(`✅ Created ${u.role}: ${u.email} / ${u.password}`);
    }
  }

  // Seed channel settings
  const channels = [
    { channel: 'email', enabled: false, connectionStatus: 'unconfigured' },
    { channel: 'whatsapp', enabled: false, connectionStatus: 'unconfigured' },
    { channel: 'sms', enabled: false, connectionStatus: 'unconfigured' },
    { channel: 'chat', enabled: false, connectionStatus: 'unconfigured' },
    { channel: 'webform', enabled: true, connectionStatus: 'connected' },
  ];

  for (const ch of channels) {
    const exists = await ChannelSettings.findOne({ channel: ch.channel });
    if (exists) {
      console.log(`Channel ${ch.channel} already exists — skipped`);
    } else {
      await ChannelSettings.create(ch);
      console.log(`✅ Created channel setting: ${ch.channel} (enabled: ${ch.enabled})`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone. Disconnected.');
  console.log('Change default passwords after first login!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
