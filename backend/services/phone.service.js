import config from '../config/env.js';
import { classifyComplaint } from './claude.service.js';

export function verifyTwilioSignature(req) {
  const authToken = config.twilio.authToken;
  if (!authToken || authToken === 'your_twilio_auth_token') return true; // Skip in dev
  // Twilio validation would go here with the twilio package
  return true;
}

export async function handlePhoneWebhook(req, io) {
  const { From, Body, TranscriptionText } = req.body;

  const rawMessage = TranscriptionText || Body || 'No message content';
  const customerContact = From || 'Unknown';

  const complaint = await classifyComplaint({
    source: 'phone',
    rawMessage,
    customerContact,
    customerName: customerContact,
  }, io);

  return complaint;
}
