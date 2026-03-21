import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
  encryptionKey: process.env.ENCRYPTION_KEY || 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '993'),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    pollInterval: parseInt(process.env.EMAIL_POLL_INTERVAL_MS || '120000'),
  },
  chatWebhookSecret: process.env.CHAT_WEBHOOK_SECRET,
  chatEnabled: process.env.CHAT_ENABLED === 'true',
  twilio: {
    enabled: process.env.TWILIO_ENABLED === 'true',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  },
  webformEnabled: process.env.WEBFORM_ENABLED !== 'false',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
