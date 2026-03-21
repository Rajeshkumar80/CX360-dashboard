import config from '../config/env.js';
import { isDbConnected } from '../config/db.js';
import Complaint from '../models/Complaint.js';
import { mockComplaints } from './mockStore.js';
import generateCaseId from '../utils/generateCaseId.js';

const SYSTEM_PROMPT = `You are CX360, an AI complaint classification engine for a professional banking and financial services support portal.

RULES:
- Always respond in valid JSON only
- No markdown, no explanation, no preamble, no code fences
- Be professional, empathetic, and concise in replies
- Detect regulatory keywords and flag appropriately
- Consider the manual hints provided by admin if present`;

const FALLBACK = {
  category: 'General',
  priority: 'Medium',
  sentiment: 'Neutral',
  severityScore: 5,
  confidence: 0,
  shouldEscalate: false,
  escalationReason: null,
  regulatoryFlag: 'None',
  regulatoryReason: null,
  aiReply: 'We have received your complaint and our team is reviewing it. You will receive a detailed response shortly.',
  suggestedAction: 'Review complaint manually.',
};

export async function classifyComplaint(data, io) {
  const { source, rawMessage, customerName, customerContact, customerId, manualCategory, manualPriority, processedBy } = data;

  const caseId = generateCaseId();

  const complaint = new Complaint({
    caseId,
    source,
    rawMessage,
    customerName: customerName || 'Unknown',
    customerId,
    customerContact,
    manualCategory,
    manualPriority,
    processedBy,
  });

  let aiResult = { ...FALLBACK };

  if (config.anthropicKey) {
    try {
      const userPrompt = `Classify this banking complaint and generate the best agent reply.

Source: ${source}
Customer Name: ${customerName || 'Unknown'}
Customer ID: ${customerId || 'N/A'}
Manual Category Hint: ${manualCategory || 'None'}
Manual Priority Hint: ${manualPriority || 'None'}
Message: ${rawMessage}

Return ONLY this JSON — no extra text:
{
  "category": "Transaction Issue|Fraud & Dispute|Loan & EMI|KYC & Account|Card Services|Net Banking / App|Interest & Charges|Branch & ATM|General|Other",
  "sentiment": "Positive|Neutral|Negative",
  "priority": "Low|Medium|High|Urgent",
  "severityScore": 1-10,
  "confidence": 0-100,
  "shouldEscalate": true|false,
  "escalationReason": "reason if shouldEscalate is true, else null",
  "regulatoryFlag": "RBI|FDIC|PCI-DSS|None",
  "regulatoryReason": "reason if flagged, else null",
  "aiReply": "Full professional banking reply here. Include case reference as [CASE_ID_PLACEHOLDER]. Be empathetic, formal, and solution-oriented.",
  "suggestedAction": "Brief internal note for the agent on what to do next"
}

Escalation Rules (auto-set shouldEscalate: true if any apply):
- Category is Fraud & Dispute
- severityScore >= 8
- Message contains words: fraud, unauthorized, stolen, scam, RBI, legal, court, complaint authority
- Priority is Urgent

Regulatory Flag Rules:
- RBI: mentions RBI, ombudsman, banking regulation, India banking authority
- PCI-DSS: mentions card data, CVV, card number exposed, payment breach
- FDIC: mentions FDIC, US federal banking, insured deposits`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.claudeModel,
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      const apiData = await response.json();
      const text = apiData.content?.[0]?.text || '';
      const cleaned = text.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch (err) {
      console.error('Claude API error:', err.message);
    }
  } else {
    // Smart mock fallback with banking categories
    await new Promise(r => setTimeout(r, 600));
    const msg = rawMessage.toLowerCase();
    
    const detectCategory = () => {
      if (manualCategory && manualCategory !== 'None') return manualCategory;
      if (msg.match(/fraud|unauthorized|stolen|scam|phishing/)) return 'Fraud & Dispute';
      if (msg.match(/transaction|payment|debit|duplicate charge|transfer/)) return 'Transaction Issue';
      if (msg.match(/loan|emi|foreclosure|mortgage/)) return 'Loan & EMI';
      if (msg.match(/kyc|account.*freez|account.*open|verification/)) return 'KYC & Account';
      if (msg.match(/card.*block|card.*deliver|pin|credit card|debit card/)) return 'Card Services';
      if (msg.match(/app|login|otp|net banking|online banking|crash/)) return 'Net Banking / App';
      if (msg.match(/interest|charges|fee|penalty|hidden/)) return 'Interest & Charges';
      if (msg.match(/atm|branch|cash.*dispens/)) return 'Branch & ATM';
      return 'General';
    };

    const category = detectCategory();
    const isFraud = category === 'Fraud & Dispute';
    const isUrgent = msg.match(/urgent|immediate|asap|emergency/);
    const severity = isFraud ? 9 : (msg.match(/angry|terrible|worst|unacceptable|hate/) ? 7 : 5);

    aiResult = {
      category,
      sentiment: msg.match(/angry|terrible|worst|unacceptable|hate|frustrated/) ? 'Negative' :
                 msg.match(/thanks|great|good|excellent|happy/) ? 'Positive' : 'Negative',
      priority: manualPriority || (isFraud || isUrgent ? 'Urgent' :
                msg.match(/unacceptable|terrible|worst/) ? 'High' : 'Medium'),
      severityScore: severity,
      confidence: 75,
      shouldEscalate: isFraud || severity >= 8,
      escalationReason: isFraud ? 'Fraud & Dispute category detected' : (severity >= 8 ? 'High severity score' : null),
      regulatoryFlag: msg.match(/rbi|ombudsman|banking regulation/) ? 'RBI' :
                      msg.match(/cvv|card number exposed|payment breach/) ? 'PCI-DSS' :
                      msg.match(/fdic|federal banking/) ? 'FDIC' : 'None',
      regulatoryReason: msg.match(/rbi|ombudsman/) ? 'RBI/Ombudsman mention detected' : null,
      aiReply: `Dear ${customerName || 'Valued Customer'},\n\nThank you for reaching out to CX360 Banking Support. Your complaint has been registered with reference number [CASE_ID_PLACEHOLDER].\n\nWe understand your concern regarding ${category.toLowerCase()} and sincerely apologize for any inconvenience caused. Our dedicated team is prioritizing your case for immediate resolution.\n\nYou can expect a comprehensive update within 24 hours. For urgent matters, please contact our priority helpline.\n\nBest regards,\nCX360 Banking Support Team`,
      suggestedAction: `Review ${category} complaint. ${isFraud ? 'URGENT: Route to Fraud Investigation team immediately.' : 'Follow standard resolution workflow.'}`,
    };
  }

  // Replace case ID placeholder
  if (aiResult.aiReply) {
    aiResult.aiReply = aiResult.aiReply.replace(/\[CASE_ID_PLACEHOLDER\]/g, caseId);
  }

  // Update complaint with AI result
  complaint.category = aiResult.category;
  complaint.sentiment = aiResult.sentiment;
  complaint.priority = aiResult.priority;
  complaint.severityScore = aiResult.severityScore || 5;
  complaint.confidence = aiResult.confidence;
  complaint.aiReply = aiResult.aiReply;
  complaint.suggestedAction = aiResult.suggestedAction;
  complaint.shouldEscalate = aiResult.shouldEscalate || false;
  complaint.escalatedTo = aiResult.shouldEscalate ? (aiResult.category === 'Fraud & Dispute' ? 'Fraud Team' : 'Senior Management') : undefined;
  complaint.escalationReason = aiResult.escalationReason;
  complaint.regulatoryFlag = aiResult.regulatoryFlag || 'None';
  complaint.regulatoryReason = aiResult.regulatoryReason;
  complaint.status = aiResult.shouldEscalate ? 'escalated' : 'classified';
  complaint.processedAt = new Date();

  // Save
  if (isDbConnected()) {
    await complaint.save();
  } else {
    complaint._id = complaint._id || Date.now().toString(16);
    complaint.createdAt = new Date();
    complaint.updatedAt = new Date();
    const plain = complaint.toObject ? complaint.toObject() : { ...complaint._doc, ...complaint };
    const exists = mockComplaints.find(c => c._id === plain._id);
    if (!exists) mockComplaints.unshift(plain);
  }

  // Emit socket events
  if (io) {
    const payload = complaint.toObject ? complaint.toObject() : complaint;
    io.emit('new-complaint', payload);
    io.emit('analytics-update');
    if (aiResult.shouldEscalate) {
      io.emit('escalation-alert', {
        complaintId: payload._id,
        caseId: payload.caseId,
        category: payload.category,
        reason: payload.escalationReason,
      });
    }
  }

  return complaint.toObject ? complaint.toObject() : complaint;
}
