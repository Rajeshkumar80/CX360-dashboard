import crypto from 'crypto';
import config from '../config/env.js';
import { classifyComplaint } from './claude.service.js';

export function verifyChatSignature(req) {
  const secret = config.chatWebhookSecret;
  if (!secret || secret === 'your_chat_platform_webhook_secret') return true; // Skip in dev

  const signature = req.headers['x-tawk-signature'] || req.headers['x-crisp-hmac'] || '';
  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function handleChatWebhook(req, io) {
  const body = req.body;

  // Extract from Tawk.to or Crisp format
  const customerName = body.visitor?.name || body.data?.user?.nickname || body.name || 'Chat Visitor';
  const transcript = body.transcript || body.data?.messages?.map(m => m.content)?.join('\n') || body.message || JSON.stringify(body);

  const complaint = await classifyComplaint({
    source: 'chat',
    rawMessage: transcript,
    customerName,
    customerContact: body.visitor?.email || body.data?.user?.email || '',
  }, io);

  return complaint;
}
