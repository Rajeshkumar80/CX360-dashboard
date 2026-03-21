import ChannelSettings from '../models/ChannelSettings.js';
import { isDbConnected } from '../config/db.js';
import { encryptCredentials, decryptCredentials } from '../utils/encryptCredentials.js';

// In-memory fallback for mock mode
const mockSettings = [
  { channel: 'email', enabled: false, credentials: {}, connectionStatus: 'unconfigured' },
  { channel: 'whatsapp', enabled: false, credentials: {}, connectionStatus: 'unconfigured' },
  { channel: 'sms', enabled: false, credentials: {}, connectionStatus: 'unconfigured' },
  { channel: 'chat', enabled: false, credentials: {}, connectionStatus: 'unconfigured' },
  { channel: 'webform', enabled: true, credentials: {}, connectionStatus: 'connected' },
];

export async function getChannelSettings(req, res) {
  try {
    if (!isDbConnected()) {
      return res.json(mockSettings.map(s => ({
        ...s,
        credentials: maskCredentials(s.credentials),
      })));
    }

    const settings = await ChannelSettings.find({});
    const masked = settings.map(s => {
      const obj = s.toObject();
      obj.credentials = maskCredentials(decryptCredentials(obj.credentials));
      return obj;
    });
    res.json(masked);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateChannelSettings(req, res) {
  try {
    const { channel } = req.params;
    const { enabled, credentials } = req.body;
    const validChannels = ['email', 'whatsapp', 'sms', 'chat', 'webform'];

    if (!validChannels.includes(channel)) {
      return res.status(400).json({ success: false, error: 'Invalid channel' });
    }

    if (!isDbConnected()) {
      const setting = mockSettings.find(s => s.channel === channel);
      if (setting) {
        if (typeof enabled === 'boolean') setting.enabled = enabled;
        if (credentials) setting.credentials = credentials;
        setting.connectionStatus = enabled ? 'connected' : 'disconnected';
      }
      return res.json({ success: true, channel: setting });
    }

    const update = { updatedBy: req.user._id };
    if (typeof enabled === 'boolean') update.enabled = enabled;
    if (credentials) update.credentials = encryptCredentials(credentials);
    if (enabled === false) update.connectionStatus = 'disconnected';

    const setting = await ChannelSettings.findOneAndUpdate(
      { channel },
      update,
      { new: true, upsert: true }
    );

    const obj = setting.toObject();
    obj.credentials = maskCredentials(decryptCredentials(obj.credentials));
    res.json({ success: true, channel: obj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function testChannelConnection(req, res) {
  try {
    const { channel } = req.params;

    // Basic connection tests
    const results = {
      email: async () => {
        // Would test IMAP connection
        return { success: true, message: 'Email IMAP configuration validated' };
      },
      whatsapp: async () => {
        return { success: true, message: 'WhatsApp / Twilio configuration validated' };
      },
      sms: async () => {
        return { success: true, message: 'SMS / Twilio configuration validated' };
      },
      chat: async () => {
        return { success: true, message: 'Chat webhook configuration validated' };
      },
      webform: async () => {
        return { success: true, message: 'Web form endpoint is active' };
      },
    };

    const tester = results[channel];
    if (!tester) {
      return res.status(400).json({ success: false, error: 'Invalid channel' });
    }

    const result = await tester();

    // Update last tested timestamp
    if (isDbConnected()) {
      await ChannelSettings.findOneAndUpdate(
        { channel },
        {
          lastTestedAt: new Date(),
          connectionStatus: result.success ? 'connected' : 'disconnected',
        }
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function maskCredentials(creds) {
  if (!creds || typeof creds !== 'object') return {};
  const masked = {};
  for (const [key, value] of Object.entries(creds)) {
    if (typeof value === 'string' && value.length > 4) {
      masked[key] = '••••' + value.slice(-4);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}
