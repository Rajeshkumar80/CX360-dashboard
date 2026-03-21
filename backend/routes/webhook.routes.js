import { Router } from 'express';
import { classifyComplaint } from '../services/claude.service.js';
import { verifyChatSignature, handleChatWebhook } from '../services/chat.service.js';
import { handlePhoneWebhook } from '../services/phone.service.js';
import { handleWhatsAppWebhook, generateWhatsAppReply } from '../services/whatsapp.service.js';

const router = Router();

// Website contact form
router.post('/webform', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!message || message.length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters' });
    }

    const complaint = await classifyComplaint({
      source: 'webform',
      rawMessage: message,
      customerName: name || 'Website Visitor',
      customerContact: email || phone || '',
    }, req.io);

    res.json({ success: true, message: 'Complaint received', id: complaint._id, caseId: complaint.caseId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Live chat webhook (Tawk.to / Crisp)
router.post('/chat', async (req, res) => {
  try {
    if (!verifyChatSignature(req)) {
      return res.status(403).json({ success: false, error: 'Invalid signature' });
    }
    const complaint = await handleChatWebhook(req, req.io);
    res.json({ success: true, id: complaint._id, caseId: complaint.caseId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Twilio SMS webhook
router.post('/phone', async (req, res) => {
  try {
    const complaint = await handlePhoneWebhook(req, req.io);
    // TwiML response
    res.type('text/xml').send(
      `<Response><Message>Thank you for contacting CX360 Banking Support. Your complaint has been logged. Reference: #${complaint.caseId}</Message></Response>`
    );
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Twilio call transcript
router.post('/phone/transcript', async (req, res) => {
  try {
    const complaint = await handlePhoneWebhook(req, req.io);
    res.json({ success: true, id: complaint._id, caseId: complaint.caseId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// WhatsApp webhook (Twilio)
router.post('/whatsapp', async (req, res) => {
  try {
    const complaint = await handleWhatsAppWebhook(req, req.io);
    const reply = generateWhatsAppReply(complaint);
    res.type('text/xml').send(
      `<Response><Message>${reply}</Message></Response>`
    );
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
