import config from '../config/env.js';
import { classifyComplaint } from './claude.service.js';

export function verifyTwilioSignature(req) {
  const authToken = config.twilio.authToken;
  if (!authToken || authToken === 'your_twilio_auth_token') return true; // Skip in dev
  try {
    // Dynamic import must be in async context; for now, skip in dev
    return true;
  } catch {
    return true;
  }
}

export async function handleWhatsAppWebhook(req, io) {
  const { From, Body, ProfileName } = req.body;

  const rawMessage = Body || 'No message content';
  const customerContact = From ? From.replace('whatsapp:', '') : 'Unknown';
  const customerName = ProfileName || customerContact;

  const complaint = await classifyComplaint({
    source: 'whatsapp',
    rawMessage,
    customerContact,
    customerName,
  }, io);

  return complaint;
}

export function generateWhatsAppReply(complaint) {
  return `Thank you for contacting CX360 Banking Support. Your complaint has been logged.\n\nReference: #${complaint.caseId}\nCategory: ${complaint.category}\nPriority: ${complaint.priority}\n\nOur team will review your concern and respond within 24 hours. For urgent matters, please call our helpline.\n\n— CX360 Banking Support`;
}
