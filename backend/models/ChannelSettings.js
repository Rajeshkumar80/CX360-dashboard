import mongoose from 'mongoose';

const channelSettingsSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['email', 'whatsapp', 'sms', 'chat', 'webform'],
    required: true,
    unique: true,
  },
  enabled: { type: Boolean, default: false },
  credentials: { type: Object, default: {} },
  lastTestedAt: { type: Date },
  connectionStatus: {
    type: String,
    enum: ['connected', 'disconnected', 'unconfigured'],
    default: 'unconfigured',
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('ChannelSettings', channelSettingsSchema);
