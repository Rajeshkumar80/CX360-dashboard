import cron from 'node-cron';
import config from '../config/env.js';
import { classifyComplaint } from '../services/claude.service.js';

let pollerRunning = false;

export async function startEmailPoller(io) {
  if (!config.email.enabled) {
    console.log('📧 Email poller disabled (EMAIL_ENABLED=false)');
    return;
  }

  if (!config.email.user || !config.email.password || config.email.user === 'your-support@gmail.com') {
    console.log('📧 Email poller skipped — EMAIL_USER/EMAIL_PASSWORD not configured');
    return;
  }

  try {
    const imapSimple = await import('imap-simple');
    const { simpleParser } = await import('mailparser');

    const imapConfig = {
      imap: {
        user: config.email.user,
        password: config.email.password,
        host: config.email.host,
        port: config.email.port,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    async function poll() {
      if (pollerRunning) return;
      pollerRunning = true;
      try {
        const connection = await imapSimple.default.connect(imapConfig);
        await connection.openBox('INBOX');

        const messages = await connection.search(['UNSEEN'], {
          bodies: [''],
          markSeen: true,
        });

        for (const msg of messages) {
          const raw = msg.parts.find(p => p.which === '')?.body || '';
          const parsed = await simpleParser(raw);

          const customerContact = parsed.from?.value?.[0]?.address || 'unknown';
          const customerName = parsed.from?.value?.[0]?.name || customerContact;
          const rawMessage = `Subject: ${parsed.subject || 'No Subject'}\n\n${parsed.text || parsed.html || ''}`;

          await classifyComplaint({
            source: 'email',
            rawMessage,
            customerName,
            customerContact,
          }, io);

          console.log(`📧 Processed email from ${customerContact}`);
        }

        await connection.end();
      } catch (err) {
        console.error('Email poll error:', err.message);
      }
      pollerRunning = false;
    }

    // Use cron instead of setInterval
    cron.schedule('*/2 * * * *', poll);
    await poll(); // Poll immediately on start
    console.log('📧 Email poller started (every 2 minutes)');
  } catch (err) {
    console.error('Email poller setup error:', err.message);
  }
}
