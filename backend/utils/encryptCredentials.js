import crypto from 'crypto';
import config from '../config/env.js';

const ALGORITHM = 'aes-256-cbc';

function getKey() {
  const hex = config.encryptionKey;
  return Buffer.from(hex.slice(0, 64), 'hex');
}

export function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encrypted) {
  if (!encrypted || !encrypted.includes(':')) return encrypted;
  const [ivHex, data] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function encryptCredentials(creds) {
  if (!creds || typeof creds !== 'object') return creds;
  const encrypted = {};
  for (const [key, value] of Object.entries(creds)) {
    encrypted[key] = typeof value === 'string' ? encrypt(value) : value;
  }
  return encrypted;
}

export function decryptCredentials(creds) {
  if (!creds || typeof creds !== 'object') return creds;
  const decrypted = {};
  for (const [key, value] of Object.entries(creds)) {
    decrypted[key] = typeof value === 'string' ? decrypt(value) : value;
  }
  return decrypted;
}
