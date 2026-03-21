import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  caseId: { type: String, unique: true, required: true },
  source: {
    type: String,
    enum: ['email', 'chat', 'webform', 'phone', 'whatsapp', 'manual'],
    required: true,
  },
  rawMessage: { type: String, required: true },
  customerName: { type: String, default: 'Unknown' },
  customerId: { type: String },
  customerContact: { type: String },
  manualCategory: { type: String },
  manualPriority: { type: String },
  category: {
    type: String,
    enum: [
      'Transaction Issue', 'Fraud & Dispute', 'Loan & EMI', 'KYC & Account',
      'Card Services', 'Net Banking / App', 'Interest & Charges', 'Branch & ATM',
      'General', 'Other',
    ],
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
  },
  severityScore: { type: Number, min: 1, max: 10 },
  aiReply: { type: String },
  confidence: { type: Number, min: 0, max: 100 },
  suggestedAction: { type: String },
  status: {
    type: String,
    enum: ['pending', 'classified', 'resolved', 'escalated'],
    default: 'pending',
  },
  // Escalation
  shouldEscalate: { type: Boolean, default: false },
  escalatedTo: { type: String },
  escalationReason: { type: String },
  // SLA
  slaStatus: {
    type: String,
    enum: ['within', 'approaching', 'breached'],
    default: 'within',
  },
  // Regulatory
  regulatoryFlag: {
    type: String,
    enum: ['RBI', 'FDIC', 'PCI-DSS', 'None'],
    default: 'None',
  },
  regulatoryReason: { type: String },
  // Resolution
  resolutionNote: { type: String },
  resolvedAt: { type: Date },
  processedAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

complaintSchema.index({ source: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ customerContact: 1 });
complaintSchema.index({ customerId: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ slaStatus: 1 });
complaintSchema.index({ regulatoryFlag: 1 });
complaintSchema.index({ rawMessage: 'text' });

export default mongoose.model('Complaint', complaintSchema);
