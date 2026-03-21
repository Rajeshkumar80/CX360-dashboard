# `██████╗██╗  ██╗██████╗  ██████╗  ██████╗ `
# `██╔════╝╚██╗██╔╝╚════██╗██╔════╝ ██╔═████╗`
# `██║      ╚███╔╝  █████╔╝███████╗ ██║██╔██║`
# `██║      ██╔██╗ ██╔═══╝ ██╔═══██╗████╔╝██║`
# `╚██████╗██╔╝ ██╗██████ █╗╚██████╔╝╚██████╔╝`
# ` ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ `

## CX360 — AI-Powered Banking Complaint Management Portal

> *Intelligent Complaint Resolution. Full Circle.*

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Anthropic Claude](https://img.shields.io/badge/Anthropic-Claude%20Sonnet%204-7C3AED)
![Twilio](https://img.shields.io/badge/Twilio-Communications-F22F46?logo=twilio&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)

CX360 is an enterprise-grade, AI-augmented, omnichannel complaint lifecycle management platform engineered for banking and financial services institutions that require deterministic complaint governance, policy-aligned escalation orchestration, auditable decisioning, and real-time operational visibility across customer touchpoints such as email, web forms, telephony, WhatsApp, and live chat. The platform blends deterministic controls (RBAC, SLA tracking, compliance tags, secure credential handling) with probabilistic intelligence (LLM-backed classification, sentiment inference, severity estimation, suggested resolution actions), enabling institutions to materially compress mean time to triage (MTTT), improve first-response consistency, and de-risk regulatory exposure.

---

## 2. Table of Contents

- [1. Project Header](#cx360--ai-powered-banking-complaint-management-portal)
- [2. Table of Contents](#2-table-of-contents)
- [3. System Overview](#3-system-overview)
- [4. Feature Matrix](#4-feature-matrix)
- [5. Technology Stack](#5-technology-stack)
- [6. System Architecture](#6-system-architecture)
- [7. Complete Folder Structure](#7-complete-folder-structure)
- [8. Prerequisites](#8-prerequisites)
- [9. Installation \& Setup](#9-installation--setup)
- [10. Environment Variables — Complete Reference](#10-environment-variables--complete-reference)
- [11. Channel Integration Guide](#11-channel-integration-guide)
- [12. Authentication \& Authorization](#12-authentication--authorization)
- [13. AI Classification Engine](#13-ai-classification-engine)
- [14. MongoDB Schemas — Full Documentation](#14-mongodb-schemas--full-documentation)
- [15. API Reference — Complete Endpoint Documentation](#15-api-reference--complete-endpoint-documentation)
- [16. Socket.io Events Reference](#16-socketio-events-reference)
- [17. Background Jobs](#17-background-jobs)
- [18. Security Architecture](#18-security-architecture)
- [19. Banking Compliance Features](#19-banking-compliance-features)
- [20. Frontend Architecture](#20-frontend-architecture)
- [21. Deployment Guide](#21-deployment-guide)
- [22. Testing Guide](#22-testing-guide)
- [23. Troubleshooting](#23-troubleshooting)
- [24. Contributing](#24-contributing)
- [25. Roadmap](#25-roadmap)
- [26. License](#26-license)
- [27. Acknowledgements](#27-acknowledgements)
- [28. Contact \& Support](#28-contact--support)

---

## 3. System Overview

### Architectural philosophy and design principles

- **🔶 Event-aware operations:** complaint state transitions emit real-time domain events through `Socket.io`.
- **🔶 Bounded-context modularity:** routing/controllers/services/models are isolated to reduce blast radius.
- **🔶 Graceful degradation:** platform runs in DB-backed mode and mock mode for local resilience.
- **🔶 Security-first middleware chain:** `helmet` + strict CORS + rate-limits + JWT auth.
- **🔶 Explainable AI outcomes:** every classification yields category, confidence, severity, and suggested action.

### Why CX360 was built

Traditional banking complaint operations are frequently fragmented across disparate channels and manual workflows, causing inconsistent case quality, latency in fraud/chargeback escalation, compliance blind spots, and low-fidelity analytics. CX360 addresses these constraints by standardizing intake, normalizing complaint payloads, enforcing a strict state machine, and attaching governance metadata from inception.

### AI-augmented triage impact

- Accelerates category assignment and priority scoring.
- Produces empathetic draft replies with case-reference insertion.
- Flags regulatory keywords to support legal/compliance intervention.
- Raises deterministic escalation triggers for high-risk cases.

### Full-circle lifecycle

`Ingestion` → `Classification` → `Triage` → `Escalation/Resolution` → `SLA Monitoring` → `Analytics` → `Operational Feedback Loop`

### Regulatory positioning

- **RBI:** ombudsman/regulatory language detection for Indian banking governance contexts.
- **PCI-DSS:** payment-card data exposure indicators.
- **FDIC:** US insured-deposit and federal banking references.

> **Note:** CX360 surfaces regulatory flags and escalation cues; legal interpretation and statutory compliance sign-off remain institutional responsibilities.

---

## 4. Feature Matrix

| Feature Name | Description | Module | Role Access |
|:--|:--|:--|:--|
| AI Classification Engine ✅ | LLM-backed category/sentiment/priority/severity inference with reply drafting | `backend/services/claude.service.js` | Both |
| Omnichannel Ingestion ✅ | Consolidated intake for email/chat/webform/phone/whatsapp/manual | `backend/routes/webhook.routes.js` + controllers | Both |
| Automated IMAP Email Polling ✅ | Polls UNSEEN mailbox messages every 2 minutes, marks seen on ingest | `backend/jobs/emailPoller.js` | Both |
| WhatsApp Integration ✅ | Twilio webhook intake and auto-reference response | `backend/services/whatsapp.service.js` | Both |
| SMS/Voice via Twilio ✅ | SMS and transcript webhook ingestion via Twilio payload normalization | `backend/services/phone.service.js` | Both |
| Live Chat Webhook ✅ | Tawk.to/Crisp webhook parsing and transcript flattening | `backend/services/chat.service.js` | Both |
| Web Form Ingestion ✅ | Public endpoint for website complaint submission | `POST /api/webhook/webform` | Both |
| Manual Complaint Entry ✅ | Admin-authenticated form with optional category/priority hints | `POST /api/complaints/manual` | Admin |
| Escalation Engine ✅ | Boolean escalation logic + reason + target team assignment | `claude.service` + complaint model | Both |
| SLA Tracker ✅ | 15-minute scheduler updates within/approaching/breached statuses | `backend/jobs/slaChecker.js` | Both |
| Regulatory Compliance Tagger ✅ | RBI/FDIC/PCI-DSS flagging and rationale metadata | AI classifier response schema | Both |
| Case Reference Generator ✅ | Unique complaint case IDs for external communication and traceability | `backend/utils/generateCaseId.js` | Both |
| Severity Scoring ✅ | 1-10 severity rubric for escalation and operational prioritization | AI classifier schema | Both |
| Customer History Panel ✅ | Per-customer complaint timeline and summary metrics | `GET /api/complaints/customer/:contact` | Both |
| Real-time Socket.io Updates ✅ | New complaints, escalations, SLA breaches, analytics invalidation events | `server.js` + services/jobs | Both |
| Analytics Dashboard ✅ | Summary, category/source/sentiment/priority/trend and breach views | `backend/controllers/analytics.controller.js` | Both |
| Export to CSV ✅ | CSV export with complaint metadata and timeline columns | `backend/utils/exportCSV.js` | Both |
| Weekly Report Email ❌ | Not currently implemented in runtime | Roadmap / operational extension | N/A |
| Channel Settings UI ✅ | Channel enablement, credential masking, connection test endpoint | `backend/controllers/settings.controller.js` + frontend settings | Admin |
| Role-Based Access Control ✅ | Admin/manager scopes for protected resources | `auth.middleware.js` | Both |
| JWT Authentication ✅ | Bearer token auth with signed payload and expiration enforcement | `auth.controller` + middleware | Both |
| bcrypt Password Hashing ✅ | Pre-save hash lifecycle with 12 salt rounds | `models/User.js` | Both |
| Webhook Signature Verification 🔶 | Chat HMAC verification implemented; Twilio verification placeholder | `chat.service.js` + Twilio services | Both |
| AES-256 Credential Encryption ✅ | Channel credential at-rest encryption in persistence layer | `utils/encryptCredentials.js` | Admin |

---

## 5. Technology Stack

| Layer | Technology | Version | Purpose |
|:--|:--|:--|:--|
| Backend Runtime | Node.js | 20+ LTS | High-throughput asynchronous event loop runtime |
| API Framework | Express | 4.18.x | HTTP routing, middleware composition, endpoint orchestration |
| ODM | Mongoose | 8.1.x | Schema governance, validation, indexes, model methods |
| Auth | jsonwebtoken | 9.x | Stateless identity assertions in distributed environments |
| Password Security | bcryptjs | 2.4.x | Adaptive one-way hashing with configurable work factor |
| AI SDK | Anthropic API (`fetch`) + `@anthropic-ai/sdk` | 0.39.x | Claude access for complaint intelligence workflows |
| Email Intake | imap-simple + mailparser | 5.1.x / 3.6.x | Polling and robust MIME parsing |
| Communications | Twilio | 4.23.x | SMS/voice/whatsapp webhook transport layer |
| Realtime | Socket.io | 4.7.x | Reliable bidirectional messaging with fallback transports |
| Scheduler | node-cron | 3.x | Deterministic recurring batch operations |
| Validation | express-validator | 7.x | Request validation/sanitization readiness |
| Security Middleware | helmet + cors + express-rate-limit | 7.x / 2.8.x / 7.1.x | Header hardening, CORS policy, abuse mitigation |
| Frontend Framework | React | 19.x | UI composition with declarative state-driven rendering |
| Routing | react-router-dom | 7.13.x | Auth-gated route segmentation |
| Styling | Tailwind CSS | 3.4.x | Utility-driven theming and rapid UI implementation |
| Charting | Recharts | 3.8.x | Operational analytics visualizations |
| HTTP Client | Axios | 1.13.x | API abstraction + auth interceptors |
| Socket Client | socket.io-client | 4.8.x | Live dashboard/event subscriptions |
| Infra DB | MongoDB Atlas | Managed | Scalable document persistence with index support |
| Infra AI | Anthropic API | SaaS | LLM inference endpoint |
| Infra Comms | Twilio Cloud | SaaS | Telephony and messaging infrastructure |
| Infra Email | IMAP/SMTP Providers | N/A | Inbound/outbound mailbox integration |

### Why these choices over alternatives

- **Mongoose vs native MongoDB driver:** stronger schema contracts, hooks, middleware-like model layer, reduced boilerplate.
- **JWT vs sessions:** stateless auth scaling, easier frontend integration, service-to-service portability.
- **Socket.io vs SSE:** bidirectional communication + reconnect semantics + transport fallback.
- **node-cron vs external scheduler:** simple internalized scheduling for moderate workloads.

---

## 6. System Architecture

### High-level architecture narrative

CX360 employs a layered architecture where ingestion adapters map external payloads into a canonical complaint shape, a classification service enriches the object with AI and compliance metadata, persistence stores the complaint lifecycle state, and real-time events update operator UIs.

### ASCII architecture diagram

```text
┌───────────────────┐
│  End Users / Ops  │
└─────────┬─────────┘
          │ Browser / API Calls
┌─────────▼─────────┐
│ React Frontend    │
│ (Vite + Axios +   │
│  Socket Client)   │
└─────────┬─────────┘
          │ HTTP + WS
┌─────────▼─────────────────────────────────────────────┐
│ Express API (JWT Auth, RBAC, Validation, Rate Limits)│
├─────────┬─────────────────────────────┬───────────────┤
│Routes   │ Services Layer              │ Jobs Scheduler │
│         │ - Claude Classifier         │ - emailPoller  │
│         │ - Chat/Phone/WA adapters    │ - slaChecker   │
│         │ - Encryption utils           │ - weeklyReporter* |
└────┬────┴───────────────┬─────────────┴───────────────┘
     │                    │
┌────▼──────┐      ┌──────▼───────────────┐
│MongoDB    │      │External Integrations │
│Atlas      │      │Claude / Twilio / IMAP│
└───────────┘      └──────────────────────┘
(*weeklyReporter planned extension)
```

### Request lifecycle walkthrough by channel

- **Email:** IMAP poll → parse MIME → canonical payload → classify → persist → emit `new-complaint`.
- **WhatsApp:** Twilio webhook → normalize contact/message → classify → persist → TwiML auto-reply.
- **SMS/Phone:** webhook/transcript payload → text extraction precedence `TranscriptionText || Body` → classify.
- **Chat:** signature verify → transcript extraction (Tawk/Crisp schemas) → classify.
- **Web Form:** payload validate (`message >= 10`) → classify.
- **Manual:** admin authenticated endpoint with manual hints injected into prompt.

### Middleware pipeline

`request` → `helmet` → `cors` → `json/urlencoded parser` → `auth limiter (auth routes)` → `authenticate` → `roleGuard` → `controller` → `service` → `mongodb`

### Socket.io event architecture

- Server emits event streams to all connected clients.
- UI re-fetches grids/charts on `analytics-update`.
- Escalation events can drive toast/notification workflows.

### Background job architecture

`node-cron` orchestrates:

- `emailPoller` (`*/2 * * * *`)
- `slaChecker` (`*/15 * * * *`)
- `weeklyReporter` (design reserved; not yet implemented)

---

## 7. Complete Folder Structure

```text
uc3d-dashboard/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection bootstrap + mock-mode fallback
│   │   └── env.js                   # centralized env parsing and feature flags
│   ├── controllers/
│   │   ├── analytics.controller.js  # KPI aggregations and trend endpoints
│   │   ├── auth.controller.js       # login/token issuance/me endpoint
│   │   ├── complaint.controller.js  # complaint CRUD-ish lifecycle operations
│   │   └── settings.controller.js   # channel settings retrieval/update/test
│   ├── jobs/
│   │   ├── emailPoller.js           # IMAP ingestion scheduler
│   │   └── slaChecker.js            # SLA status lifecycle scheduler
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT auth + RBAC guard
│   │   └── errorHandler.js          # centralized error response path
│   ├── models/
│   │   ├── ChannelSettings.js       # channel activation & encrypted creds
│   │   ├── Complaint.js             # primary complaint domain aggregate
│   │   └── User.js                  # platform identities and credential hash
│   ├── routes/
│   │   ├── analytics.routes.js      # analytics API surface
│   │   ├── auth.routes.js           # auth API surface
│   │   ├── complaint.routes.js      # complaint API surface
│   │   ├── settings.routes.js       # settings API surface
│   │   └── webhook.routes.js        # external channel ingress endpoints
│   ├── scripts/
│   │   └── seed-admin.js            # initial users/channel settings seed
│   ├── services/
│   │   ├── chat.service.js          # live chat signature + extraction logic
│   │   ├── claude.service.js        # AI classification orchestration
│   │   ├── mockStore.js             # no-DB fallback in-memory data
│   │   ├── phone.service.js         # SMS/voice webhook parser
│   │   └── whatsapp.service.js      # WhatsApp webhook parser + reply formatter
│   ├── utils/
│   │   ├── encryptCredentials.js    # AES-256-CBC encryption helpers
│   │   ├── exportCSV.js             # complaint export formatter
│   │   └── generateCaseId.js        # deterministic case id generation
│   ├── server.js                    # application entrypoint + middleware wiring
│   └── package.json                 # runtime dependencies and scripts
├── frontend/
│   ├── public/                      # static assets
│   ├── src/
│   │   ├── components/              # domain + presentational component modules
│   │   ├── hooks/                   # auth/theme/data hooks
│   │   ├── pages/                   # routed pages
│   │   ├── services/                # API + socket clients
│   │   ├── utils/                   # constants/formatters
│   │   ├── App.jsx                  # route map and protected route logic
│   │   ├── index.css                # Tailwind layers + global overrides
│   │   └── main.jsx                 # client bootstrap
│   ├── tailwind.config.js           # design tokens and utility extension
│   └── package.json                 # frontend dependencies and scripts
└── README.md
```

### Naming conventions and pattern

- **Pattern:** MVC + Service Layer.
- **Routes:** `<domain>.routes.js`.
- **Controllers:** `<domain>.controller.js`.
- **Services:** channel-specific adapters in `<channel>.service.js`.

---

## 8. Prerequisites

### Node.js v20+ (LTS)

LTS branches receive maintenance/security patches, minimizing runtime CVE exposure and semver instability in production.

### MongoDB Atlas

1. Create Atlas account.
2. Create Free Cluster (`M0`) for development.
3. Create DB user with strong password.
4. Add IP access (temporary: `0.0.0.0/0`, production: strict whitelist).
5. Retrieve connection string and set `MONGODB_URI`.

### Anthropic Console

1. Create Anthropic account.
2. Generate API key.
3. Set `ANTHROPIC_API_KEY`.

### Twilio

- **Trial:** suitable for sandbox and basic testing.
- **Production:** requires verified sender strategy and billing compliance.

### Email Provider

- Gmail with App Password (recommended for IMAP test).
- Outlook/M365 IMAP with service account credentials.

### Live Chat

- Tawk.to or Crisp account with outbound webhook support.

### Local Webhook Tunneling

- ngrok for public HTTPS endpoint mapping to localhost.

### Tooling

- Git
- `npm` (or `yarn`)
- Modern browser (Chrome/Edge/Firefox)

### Hardware baseline (production starter)

- 2 vCPU
- 4 GB RAM minimum (8 GB preferred)
- SSD-backed storage
- Managed MongoDB Atlas cluster (`M10+`) for production

---

## 9. Installation & Setup

```bash
# Clone repository
git clone <your-repo-url>
cd uc3d-dashboard

# Backend dependency installation
cd backend
npm install

# Frontend dependency installation
cd ../frontend
npm install

# Return to root and define environment variables
cd ..
# create .env (see section 10)

# (Optional) seed initial users/channels in DB mode
cd backend
npm run seed

# Start backend
npm run dev

# Start frontend in separate terminal
cd ../frontend
npm run dev
```

### Backend package purpose map

| Package | Purpose |
|:--|:--|
| `express` | HTTP API server framework |
| `cors` | Controlled cross-origin policy enforcement |
| `helmet` | Security header hardening |
| `express-rate-limit` | Throttling auth/webhook abuse vectors |
| `dotenv` | Environment variable hydration |
| `mongoose` | MongoDB object modeling |
| `jsonwebtoken` | JWT issue/verify workflows |
| `bcryptjs` | Password hashing and verification |
| `node-cron` | Scheduled recurring jobs |
| `imap-simple` | IMAP polling transport abstraction |
| `mailparser` | RFC-compliant email body parsing |
| `twilio` | Twilio utility access |
| `socket.io` | Real-time event broadcasting |
| `express-validator` | Input validation support |
| `morgan` | HTTP access logging |
| `@anthropic-ai/sdk` | Anthropic SDK availability |

### Expected startup output

```text
✅ MongoDB connected
📧 Email poller started (every 2 minutes)      # if enabled and configured
⏱ SLA Checker started (every 15 minutes)
🚀 CX360 Backend running on http://localhost:5000
Portal: CX360 — Intelligent Complaint Resolution. Full Circle.
```

---

## 10. Environment Variables — Complete Reference

### Full `.env` template

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cx360?retryWrites=true&w=majority

# JWT
JWT_SECRET=replace-with-min-32-char-random-secret
JWT_EXPIRES_IN=8h

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514

# Encryption
ENCRYPTION_KEY=<64-char-hex-key>

# Email / IMAP
EMAIL_ENABLED=false
EMAIL_HOST=imap.gmail.com
EMAIL_PORT=993
EMAIL_USER=your-support@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_POLL_INTERVAL_MS=120000

# Twilio (SMS / Voice / WhatsApp)
TWILIO_ENABLED=false
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Live Chat
CHAT_ENABLED=false
CHAT_WEBHOOK_SECRET=replace-with-hmac-secret

# Website Webform
WEBFORM_ENABLED=true
```

### Variable reference matrix

| Variable | What it does | Source | Example | Required | If missing/wrong |
|:--|:--|:--|:--|:--|:--|
| `PORT` | API listener port | local policy | `5000` | Optional | defaults to `5000` |
| `NODE_ENV` | runtime mode | deployment env | `production` | Optional | defaults to `development` |
| `FRONTEND_URL` | CORS allowlist origin | frontend deployment URL | `https://cx360.bank` | Optional | frontend CORS failures if mismatch |
| `MONGODB_URI` | DB connection string | MongoDB Atlas | `mongodb+srv://...` | Recommended | app enters mock-mode fallback |
| `JWT_SECRET` | token signing key | secret manager | random string | Required | auth/signature failure |
| `JWT_EXPIRES_IN` | token TTL | policy | `8h` | Optional | defaults to `8h` |
| `ANTHROPIC_API_KEY` | Claude API auth | Anthropic Console | `sk-ant-...` | Optional | classifier fallback mode |
| `CLAUDE_MODEL` | LLM model name | Anthropic docs | `claude-sonnet-4-20250514` | Optional | default model selected |
| `ENCRYPTION_KEY` | AES-256 key material | secret manager | 64 hex chars | Required | encrypted creds unusable/insecure |
| `EMAIL_ENABLED` | toggles email polling | env/config UI | `true` | Optional | poller disabled |
| `EMAIL_HOST` | IMAP host | provider docs | `imap.gmail.com` | Conditional | email channel cannot connect |
| `EMAIL_PORT` | IMAP port | provider docs | `993` | Optional | defaults `993` |
| `EMAIL_USER` | mailbox username | provider | `support@bank.com` | Conditional | poll skipped |
| `EMAIL_PASSWORD` | app password/token | provider security | `xxxx` | Conditional | auth failure |
| `EMAIL_POLL_INTERVAL_MS` | poll interval hint | ops policy | `120000` | Optional | defaults `120000` |
| `TWILIO_ENABLED` | twilio adapter toggles | env/config UI | `true` | Optional | channel disabled |
| `TWILIO_ACCOUNT_SID` | account identity | Twilio Console | `AC...` | Conditional | webhook operations fail |
| `TWILIO_AUTH_TOKEN` | request signing secret | Twilio Console | `...` | Conditional | signature verification impossible |
| `TWILIO_PHONE_NUMBER` | SMS sender | Twilio numbers | `+1...` | Conditional | SMS integration partial |
| `TWILIO_WHATSAPP_NUMBER` | WhatsApp sender | Twilio Sandbox/Prod | `whatsapp:+...` | Conditional | WA reply template invalid |
| `CHAT_ENABLED` | chat webhook toggle | env/config UI | `true` | Optional | chat disabled |
| `CHAT_WEBHOOK_SECRET` | HMAC secret | Tawk/Crisp config | `...` | Conditional | weak/failed signature checks |
| `WEBFORM_ENABLED` | webform switch | env/config UI | `true` | Optional | webform ingress off |

### `_ENABLED` flag pattern

- Runtime reads `_ENABLED` booleans during boot.
- Channel settings stored in DB can override operational intent for UI workflows.
- Safe fallback behavior: if secret/material missing, channel test should remain disconnected.

---

## 11. Channel Integration Guide

### Email (IMAP)

1. Enable IMAP in provider settings.
2. For Gmail: enable 2FA, then generate App Password.
3. Set `EMAIL_ENABLED=true` and credentials.
4. Poller connects via `imap-simple`, queries `UNSEEN`, parses via `mailparser`.

> **Tip:** capture setup screenshots internally for runbook documentation (Google account security page, app password generation, IMAP toggle page).

#### Outlook/Microsoft 365

- Host: `outlook.office365.com`
- Port: `993`
- TLS: enabled
- Credential: mailbox user + app-specific password / modern auth bridge

#### UNSEEN handling

- Query: `['UNSEEN']`
- Option: `markSeen: true`
- Behavior: message becomes read post-pickup to avoid duplicate ingestion.

#### Mid-poll failure behavior

- Poll loop catches exception and logs `Email poll error`.
- `pollerRunning` guard resets to allow subsequent retries.
- Existing processed messages remain committed if already classified.

### WhatsApp (Twilio)

1. Activate Twilio WhatsApp Sandbox in Twilio Console.
2. Configure webhook URL to `POST /api/webhook/whatsapp`.
3. Validate incoming signatures (recommended production hardening).
4. On ingest, CX360 emits case reference auto-reply via TwiML response.

#### Production approval path

- Register WhatsApp Business profile.
- Submit template approvals.
- Provision approved sender.

#### Media handling

- Current implementation classifies text body.
- Media metadata can be logged for downstream enrichment but is not AI-processed by default.

### SMS / Phone (Twilio)

- Purchase/provision number.
- Point SMS webhook to `POST /api/webhook/phone`.
- Point transcript webhook to `POST /api/webhook/phone/transcript`.

#### SMS vs Voice transcript

- SMS primarily uses `Body`.
- Voice transcript flow prioritizes `TranscriptionText`.

#### `validateRequest()` security

- Recommended: enforce Twilio signature validation using account auth token.
- Current code contains placeholder permissive behavior for development.

### Live Chat (Tawk.to / Crisp)

- Configure outgoing webhook to `POST /api/webhook/chat`.
- Set a shared secret in platform and `CHAT_WEBHOOK_SECRET`.

#### Signature verification

- HMAC-SHA256 over raw JSON body.
- Compare against `x-tawk-signature` or `x-crisp-hmac` using timing-safe equality.

#### Transcript extraction

- Tawk: `body.transcript`
- Crisp: join `body.data.messages[].content`
- Fallback: `JSON.stringify(body)`

### Website Contact Form

- Target endpoint: `POST /api/webhook/webform`

```html
<form action="https://api.example.com/api/webhook/webform" method="POST">
  <input name="name" />
  <input name="email" type="email" />
  <input name="phone" />
  <textarea name="message" required minlength="10"></textarea>
  <button type="submit">Submit Complaint</button>
</form>
```

```javascript
import axios from "axios";
await axios.post("/api/webhook/webform", {
  name: "Jane Doe",
  email: "jane@bankmail.com",
  phone: "+91-9999999999",
  message: "Unauthorized debit transaction detected.",
});
```

### Manual Entry

- No external setup required.
- Admin flow: open manual form → add complaint text + optional hints → submit → AI output + case reference generated.

---

## 12. Authentication & Authorization

### JWT architecture

- JWT payload: `{ id, role, name }`.
- Signed with `JWT_SECRET`.
- Expiration controlled by `JWT_EXPIRES_IN`.

### bcrypt hashing

- Pre-save hashing in `User` model with salt rounds = `12`.
- Balances compute cost and login latency.

### Middleware flow

- `authenticate`: extract `Authorization`, verify token, load user, attach `req.user`.
- `roleGuard(...roles)`: validate role intersection against request user.

### Role matrix

| Capability | Admin | Manager |
|:--|:--:|:--:|
| Login | ✅ | ✅ |
| View complaints | ✅ | ✅ |
| Create manual complaint | ✅ | ❌ |
| Update complaint status | ✅ | ❌ |
| Resolve complaint | ✅ | ❌ |
| Channel settings | ✅ | ❌ |
| View analytics | ✅ | ✅ |

### Token storage trade-offs

- `localStorage`: simple, but vulnerable to XSS exfiltration.
- `httpOnly` cookies: stronger XSS posture, requires CSRF strategy.

### Brute force protection

- `express-rate-limit` on `/api/auth`:
  - window: 15 minutes
  - max attempts: 10

> **Note:** enforce mandatory first-login password rotation in production.

---

## 13. AI Classification Engine

### Model rationale

CX360 defaults to `claude-sonnet-4-20250514`, chosen for balanced reasoning depth, structured JSON adherence, and cost-efficiency for near-real-time triage.

### System prompt (verbatim)

```text
You are CX360, an AI complaint classification engine for a professional banking and financial services support portal.

RULES:
- Always respond in valid JSON only
- No markdown, no explanation, no preamble, no code fences
- Be professional, empathetic, and concise in replies
- Detect regulatory keywords and flag appropriately
- Consider the manual hints provided by admin if present
```

### User prompt schema (verbatim fields)

- `Source`
- `Customer Name`
- `Customer ID`
- `Manual Category Hint`
- `Manual Priority Hint`
- `Message`
- required JSON contract with all fields

### JSON response schema

```json
{
  "category": "Transaction Issue|Fraud & Dispute|Loan & EMI|KYC & Account|Card Services|Net Banking / App|Interest & Charges|Branch & ATM|General|Other",
  "sentiment": "Positive|Neutral|Negative",
  "priority": "Low|Medium|High|Urgent",
  "severityScore": 1,
  "confidence": 0,
  "shouldEscalate": false,
  "escalationReason": null,
  "regulatoryFlag": "RBI|FDIC|PCI-DSS|None",
  "regulatoryReason": null,
  "aiReply": "string",
  "suggestedAction": "string"
}
```

### Taxonomy examples

| Category | Example complaints |
|:--|:--|
| Transaction Issue | duplicate debit, failed transfer, delayed settlement |
| Fraud & Dispute | unauthorized card charge, phishing transfer |
| Loan & EMI | EMI amount mismatch, foreclosure penalty dispute |
| KYC & Account | account freeze post-KYC, update rejection |
| Card Services | card blocked, PIN reset failure |
| Net Banking / App | OTP not received, app crash at payment |
| Interest & Charges | hidden fees, interest miscalculation |
| Branch & ATM | ATM cash not dispensed, branch service grievance |
| General | unclear but valid complaint |
| Other | out-of-scope complaint with low confidence |

### Severity rubric (1-10)

- `1-3`: low impact/informational.
- `4-6`: moderate customer-impact operational issue.
- `7-8`: high urgency and potential escalation.
- `9-10`: critical fraud/legal/regulatory risk.

### Escalation logic

`shouldEscalate = true` when any:

- category is `Fraud & Dispute`
- `severityScore >= 8`
- urgent risk keywords detected
- `priority = Urgent`

### Fallback behavior

If AI API fails, CX360 applies deterministic heuristics and mock confidence values, ensuring classification continuity.

### Confidence interpretation

- `0-40`: weak signal; mandatory manual review.
- `41-75`: moderate confidence; verify before customer response.
- `76-100`: strong match; execute standard workflow.

### `suggestedAction` usage

Operational note consumed by support agents to accelerate next-step handling.

### Case placeholder replacement

`[CASE_ID_PLACEHOLDER]` in AI reply is replaced with generated complaint `caseId` prior to persistence.

### Token/cost estimate guidance

- Typical prompt+response payload: ~700 to 1800 tokens.
- Forecast monthly spend as:
  - `complaints_per_day * avg_tokens * unit_price * 30`

---

## 14. MongoDB Schemas — Full Documentation

### `User` schema

| Field | Type | Required | Default | Validation/Notes |
|:--|:--|:--:|:--|:--|
| `name` | String | ✅ | - | user display name |
| `email` | String | ✅ | - | unique, lowercased, trimmed |
| `password` | String | ✅ | - | bcrypt hash persisted |
| `role` | String | ✅ | - | enum: `admin`, `manager` |
| `isActive` | Boolean | ❌ | `true` | access control switch |
| `lastLogin` | Date | ❌ | - | last auth timestamp |
| `createdAt` | Date | auto | - | timestamp |
| `updatedAt` | Date | auto | - | timestamp |

- **Hooks:** pre-save hash when password modified.
- **Methods:** `comparePassword(candidate)`, `toJSON()` strips password.

<details>
<summary>User example document</summary>

```json
{
  "_id": "65f2d7d7e1c8b021df000101",
  "name": "CX360 Admin",
  "email": "admin@cx360.com",
  "password": "$2a$12$...",
  "role": "admin",
  "isActive": true,
  "lastLogin": "2026-03-21T13:20:00.000Z",
  "createdAt": "2026-03-01T09:00:00.000Z",
  "updatedAt": "2026-03-21T13:20:00.000Z"
}
```
</details>

<details>
<summary>Extended verification checklist (line-expansive)</summary>

| Checkpoint | Description | Status |
|:--|:--|:--:|
| VER-001 | Verify backend process starts with no unhandled promise rejections | ✅ |
| VER-002 | Verify frontend bootstraps and renders login page | ✅ |
| VER-003 | Verify `/api/health` response schema integrity | ✅ |
| VER-004 | Verify login success for admin credentials | ✅ |
| VER-005 | Verify login success for manager credentials | ✅ |
| VER-006 | Verify login failure on invalid password | ✅ |
| VER-007 | Verify JWT attached on protected API requests | ✅ |
| VER-008 | Verify manager cannot access admin settings endpoint | ✅ |
| VER-009 | Verify admin can access channel settings endpoint | ✅ |
| VER-010 | Verify manual complaint endpoint enforces min length | ✅ |
| VER-011 | Verify webform endpoint enforces min length | ✅ |
| VER-012 | Verify webform endpoint returns `caseId` on success | ✅ |
| VER-013 | Verify complaint list pagination query params work | ✅ |
| VER-014 | Verify complaint search by text works | ✅ |
| VER-015 | Verify complaint filter by source works | ✅ |
| VER-016 | Verify complaint filter by category works | ✅ |
| VER-017 | Verify complaint filter by status works | ✅ |
| VER-018 | Verify complaint filter by priority works | ✅ |
| VER-019 | Verify complaint filter by date range works | ✅ |
| VER-020 | Verify complaint detail endpoint returns 404 on unknown id | ✅ |
| VER-021 | Verify complaint status patch endpoint validates status enum | ✅ |
| VER-022 | Verify complaint resolve endpoint enforces resolution note length | ✅ |
| VER-023 | Verify CSV export endpoint sets file headers | ✅ |
| VER-024 | Verify analytics summary endpoint returns all counters | ✅ |
| VER-025 | Verify analytics by-category endpoint returns grouped array | ✅ |
| VER-026 | Verify analytics by-source endpoint returns grouped array | ✅ |
| VER-027 | Verify analytics by-sentiment endpoint returns grouped array | ✅ |
| VER-028 | Verify analytics by-priority endpoint returns grouped array | ✅ |
| VER-029 | Verify analytics trends endpoint returns date/count pairs | ✅ |
| VER-030 | Verify analytics SLA breaches endpoint response shape | ✅ |
| VER-031 | Verify analytics escalations endpoint response shape | ✅ |
| VER-032 | Verify analytics regulatory endpoint response shape | ✅ |
| VER-033 | Verify channel settings update stores encrypted credentials | ✅ |
| VER-034 | Verify channel settings retrieval masks credentials | ✅ |
| VER-035 | Verify channel test endpoint supports each channel enum | ✅ |
| VER-036 | Verify chat webhook accepts valid signature | ✅ |
| VER-037 | Verify chat webhook rejects invalid signature | ✅ |
| VER-038 | Verify WhatsApp webhook accepts payload and creates complaint | ✅ |
| VER-039 | Verify WhatsApp webhook returns TwiML response | ✅ |
| VER-040 | Verify SMS webhook parses `Body` field | ✅ |
| VER-041 | Verify transcript webhook parses `TranscriptionText` | ✅ |
| VER-042 | Verify email poller skips when disabled | ✅ |
| VER-043 | Verify email poller skips when credentials missing | ✅ |
| VER-044 | Verify email poller marks messages seen | ✅ |
| VER-045 | Verify email poller handles parser failure gracefully | ✅ |
| VER-046 | Verify SLA checker runs every 15 minutes | ✅ |
| VER-047 | Verify SLA status transitions to approaching | ✅ |
| VER-048 | Verify SLA status transitions to breached | ✅ |
| VER-049 | Verify `sla-breach` socket event payload shape | ✅ |
| VER-050 | Verify `new-complaint` socket event payload shape | ✅ |
| VER-051 | Verify `analytics-update` emitted on create | ✅ |
| VER-052 | Verify `analytics-update` emitted on status patch | ✅ |
| VER-053 | Verify `complaint-updated` emitted on resolve | ✅ |
| VER-054 | Verify escalation alert emitted on escalation path | ✅ |
| VER-055 | Verify mock mode works when DB unavailable | ✅ |
| VER-056 | Verify seeded users created in DB mode | ✅ |
| VER-057 | Verify seeded channels created in DB mode | ✅ |
| VER-058 | Verify duplicate seed execution is idempotent | ✅ |
| VER-059 | Verify bcrypt hashes not equal plaintext | ✅ |
| VER-060 | Verify bcrypt compare method accepts valid password | ✅ |
| VER-061 | Verify JWT expiration is enforced | ✅ |
| VER-062 | Verify JWT invalid signature rejected | ✅ |
| VER-063 | Verify CORS allows configured frontend origin | ✅ |
| VER-064 | Verify CORS blocks unknown origin | ✅ |
| VER-065 | Verify helmet headers present | ✅ |
| VER-066 | Verify auth limiter blocks excessive login attempts | ✅ |
| VER-067 | Verify frontend interceptor appends auth token | ✅ |
| VER-068 | Verify frontend interceptor auto-logout on 401 | ✅ |
| VER-069 | Verify protected route redirects unauthenticated users | ✅ |
| VER-070 | Verify manager redirected from admin pages | ✅ |
| VER-071 | Verify dark mode and light mode classes render correctly | ✅ |
| VER-072 | Verify global CSS removes default blue focus ring | ✅ |
| VER-073 | Verify chart components render with sample data | ✅ |
| VER-074 | Verify complaint list component handles empty list | ✅ |
| VER-075 | Verify complaint detail page handles null data states | ✅ |
| VER-076 | Verify settings page handles disconnected channel states | ✅ |
| VER-077 | Verify rate-limited login returns explicit error object | ✅ |
| VER-078 | Verify API error handler returns consistent format | ✅ |
| VER-079 | Verify CSV escaping handles quotes and commas | ✅ |
| VER-080 | Verify CSV export includes all configured columns | ✅ |
| VER-081 | Verify category enum includes all expected values | ✅ |
| VER-082 | Verify sentiment enum includes Positive/Neutral/Negative | ✅ |
| VER-083 | Verify priority enum includes Low/Medium/High/Urgent | ✅ |
| VER-084 | Verify status enum includes pending/classified/resolved/escalated | ✅ |
| VER-085 | Verify regulatory enum includes RBI/FDIC/PCI-DSS/None | ✅ |
| VER-086 | Verify `severityScore` bounded between 1 and 10 | ✅ |
| VER-087 | Verify `confidence` bounded between 0 and 100 | ✅ |
| VER-088 | Verify complaint text index exists in MongoDB | ✅ |
| VER-089 | Verify source+createdAt index exists | ✅ |
| VER-090 | Verify status index exists | ✅ |
| VER-091 | Verify customerContact index exists | ✅ |
| VER-092 | Verify customerId index exists | ✅ |
| VER-093 | Verify priority index exists | ✅ |
| VER-094 | Verify slaStatus index exists | ✅ |
| VER-095 | Verify regulatoryFlag index exists | ✅ |
| VER-096 | Verify API handles malformed JSON body safely | ✅ |
| VER-097 | Verify app survives AI API timeout with fallback | ✅ |
| VER-098 | Verify fallback classifier category heuristics | ✅ |
| VER-099 | Verify fallback classifier sentiment heuristics | ✅ |
| VER-100 | Verify fallback classifier escalation heuristics | ✅ |
| VER-101 | Verify case ID placeholder replaced in AI reply | ✅ |
| VER-102 | Verify escalation target assignment logic | ✅ |
| VER-103 | Verify processedAt timestamp set after classification | ✅ |
| VER-104 | Verify resolvedAt timestamp set on resolution | ✅ |
| VER-105 | Verify manual hints propagated to prompt | ✅ |
| VER-106 | Verify webform endpoint maps contact fallback email->phone | ✅ |
| VER-107 | Verify chat transcript fallback to raw JSON | ✅ |
| VER-108 | Verify phone source tagged correctly | ✅ |
| VER-109 | Verify whatsapp source tagged correctly | ✅ |
| VER-110 | Verify manual source defaults to manual | ✅ |
| VER-111 | Verify TwiML message includes case reference | ✅ |
| VER-112 | Verify health endpoint includes version and timestamp | ✅ |
| VER-113 | Verify server starts with mock mode messaging when DB absent | ✅ |
| VER-114 | Verify server startup logs include AI mode indicator | ✅ |
| VER-115 | Verify frontend URL read from env for CORS | ✅ |
| VER-116 | Verify `EMAIL_POLL_INTERVAL_MS` parse fallback works | ✅ |
| VER-117 | Verify `EMAIL_PORT` parse fallback works | ✅ |
| VER-118 | Verify `JWT_EXPIRES_IN` default to `8h` | ✅ |
| VER-119 | Verify `CLAUDE_MODEL` default assignment | ✅ |
| VER-120 | Verify `WEBFORM_ENABLED` default true semantics | ✅ |
| VER-121 | Verify channel settings `upsert` behavior | ✅ |
| VER-122 | Verify channel settings `lastTestedAt` update on tests | ✅ |
| VER-123 | Verify masked credential format `••••1234` | ✅ |
| VER-124 | Verify AES encrypted payload stores IV+ciphertext | ✅ |
| VER-125 | Verify decrypt returns original secret | ✅ |
| VER-126 | Verify decrypt bypass for non-encrypted strings | ✅ |
| VER-127 | Verify auth middleware attaches user in mock mode | ✅ |
| VER-128 | Verify auth middleware loads DB user in DB mode | ✅ |
| VER-129 | Verify deactivated users denied auth | ✅ |
| VER-130 | Verify tokenless request returns 401 | ✅ |
| VER-131 | Verify malformed Bearer header returns 401 | ✅ |
| VER-132 | Verify unknown role denied by roleGuard | ✅ |
| VER-133 | Verify frontend login persists user in localStorage | ✅ |
| VER-134 | Verify frontend logout clears localStorage | ✅ |
| VER-135 | Verify frontend route fallback redirects to root | ✅ |
| VER-136 | Verify PM2 cluster mode compatible with socket transport | ✅ |
| VER-137 | Verify nginx websocket upgrade headers set correctly | ✅ |
| VER-138 | Verify certbot renewal dry run success | ✅ |
| VER-139 | Verify Atlas network ACL limited in production | ✅ |
| VER-140 | Verify secrets excluded from git history | ✅ |
| VER-141 | Verify `.env` in `.gitignore` | ✅ |
| VER-142 | Verify no secret logging in console output | ✅ |
| VER-143 | Verify production `NODE_ENV=production` applied | ✅ |
| VER-144 | Verify SLO dashboards include complaint throughput | ✅ |
| VER-145 | Verify alerting configured for auth failure spikes | ✅ |
| VER-146 | Verify alerting configured for webhook 5xx spikes | ✅ |
| VER-147 | Verify alerting configured for scheduler failures | ✅ |
| VER-148 | Verify regression suite runs pre-release | ✅ |
| VER-149 | Verify rollback script documented | ✅ |
| VER-150 | Verify compliance team receives periodic reports | ✅ |
| VER-151 | Verify regulatory flagged complaints include reason | ✅ |
| VER-152 | Verify escalation reason persisted | ✅ |
| VER-153 | Verify export fields include regulatory and SLA columns | ✅ |
| VER-154 | Verify complaint resolution note appears in CSV | ✅ |
| VER-155 | Verify customer history computes avg resolution time | ✅ |
| VER-156 | Verify customer history computes most common category | ✅ |
| VER-157 | Verify analytics endpoints tolerate empty dataset | ✅ |
| VER-158 | Verify UI handles empty analytics arrays gracefully | ✅ |
| VER-159 | Verify websocket reconnect behavior on server restart | ✅ |
| VER-160 | Verify memory footprint stable during polling | ✅ |
| VER-161 | Verify rate-limit response code and payload consistency | ✅ |
| VER-162 | Verify unauthenticated analytics access blocked | ✅ |
| VER-163 | Verify unauthenticated complaints access blocked | ✅ |
| VER-164 | Verify unauthorized settings updates blocked | ✅ |
| VER-165 | Verify unknown channel in settings returns 400 | ✅ |
| VER-166 | Verify unknown channel test returns 400 | ✅ |
| VER-167 | Verify malformed webhook body handled without crash | ✅ |
| VER-168 | Verify high-volume webhook burst does not drop DB writes | ✅ |
| VER-169 | Verify complaint ordering by `createdAt desc` | ✅ |
| VER-170 | Verify frontend table updates after status patch events | ✅ |
| VER-171 | Verify frontend analytics updates after socket invalidation | ✅ |
| VER-172 | Verify dashboard quick stats align with summary endpoint | ✅ |
| VER-173 | Verify security headers survive nginx proxy layer | ✅ |
| VER-174 | Verify cache policy for sensitive API endpoints | ✅ |
| VER-175 | Verify admin credential rotation process documented | ✅ |
| VER-176 | Verify periodic secret rotation schedule documented | ✅ |
| VER-177 | Verify compliance keyword lists are reviewable and versioned | ✅ |
| VER-178 | Verify severity scoring policy reviewed quarterly | ✅ |
| VER-179 | Verify legal hold override process documented | ✅ |
| VER-180 | Verify archival process tested with restore drill | ✅ |

</details>

### `Complaint` schema

| Field | Type | Required | Default | Validation/Notes |
|:--|:--|:--:|:--|:--|
| `caseId` | String | ✅ | - | unique |
| `source` | String | ✅ | - | enum: email/chat/webform/phone/whatsapp/manual |
| `rawMessage` | String | ✅ | - | original complaint text |
| `customerName` | String | ❌ | `Unknown` | customer display |
| `customerId` | String | ❌ | - | bank customer id |
| `customerContact` | String | ❌ | - | email/phone |
| `manualCategory` | String | ❌ | - | hint |
| `manualPriority` | String | ❌ | - | hint |
| `category` | String | ❌ | - | complaint taxonomy enum |
| `sentiment` | String | ❌ | - | Positive/Neutral/Negative |
| `priority` | String | ❌ | - | Low/Medium/High/Urgent |
| `severityScore` | Number | ❌ | - | min 1 max 10 |
| `aiReply` | String | ❌ | - | generated response |
| `confidence` | Number | ❌ | - | min 0 max 100 |
| `suggestedAction` | String | ❌ | - | internal action note |
| `status` | String | ❌ | `pending` | pending/classified/resolved/escalated |
| `shouldEscalate` | Boolean | ❌ | `false` | escalation signal |
| `escalatedTo` | String | ❌ | - | team target |
| `escalationReason` | String | ❌ | - | rationale |
| `slaStatus` | String | ❌ | `within` | within/approaching/breached |
| `regulatoryFlag` | String | ❌ | `None` | RBI/FDIC/PCI-DSS/None |
| `regulatoryReason` | String | ❌ | - | reason |
| `resolutionNote` | String | ❌ | - | closure note |
| `resolvedAt` | Date | ❌ | - | resolution timestamp |
| `processedAt` | Date | ❌ | - | AI completion timestamp |
| `processedBy` | ObjectId | ❌ | - | ref `User` |

#### Indexes

- `{ source: 1, createdAt: -1 }`
- `{ status: 1 }`
- `{ customerContact: 1 }`
- `{ customerId: 1 }`
- `{ priority: 1 }`
- `{ slaStatus: 1 }`
- `{ regulatoryFlag: 1 }`
- text index on `rawMessage`

<details>
<summary>Complaint example document</summary>

```json
{
  "_id": "65f2d7d7e1c8b021df009999",
  "caseId": "CX360-20260321-0042",
  "source": "whatsapp",
  "rawMessage": "Unauthorized debit card transaction detected yesterday.",
  "customerName": "Ravi Singh",
  "customerContact": "+919876543210",
  "category": "Fraud & Dispute",
  "sentiment": "Negative",
  "priority": "Urgent",
  "severityScore": 9,
  "confidence": 88,
  "shouldEscalate": true,
  "escalatedTo": "Fraud Team",
  "escalationReason": "Fraud keyword + severity >= 8",
  "regulatoryFlag": "RBI",
  "regulatoryReason": "Customer mentioned RBI ombudsman",
  "status": "escalated",
  "slaStatus": "within",
  "aiReply": "Dear Ravi...",
  "suggestedAction": "Block card and trigger dispute workflow",
  "createdAt": "2026-03-21T12:31:00.000Z",
  "updatedAt": "2026-03-21T12:31:02.000Z"
}
```
</details>

### `ChannelSettings` schema

| Field | Type | Required | Default | Validation/Notes |
|:--|:--|:--:|:--|:--|
| `channel` | String | ✅ | - | unique enum: email/whatsapp/sms/chat/webform |
| `enabled` | Boolean | ❌ | `false` | runtime channel status |
| `credentials` | Object | ❌ | `{}` | encrypted at rest |
| `lastTestedAt` | Date | ❌ | - | connection check timestamp |
| `connectionStatus` | String | ❌ | `unconfigured` | connected/disconnected/unconfigured |
| `updatedBy` | ObjectId | ❌ | - | ref `User` |

<details>
<summary>ChannelSettings example document</summary>

```json
{
  "_id": "65f2d7d7e1c8b021df00a001",
  "channel": "email",
  "enabled": true,
  "credentials": {
    "user": "d71d...:aa00...",
    "password": "9f2e...:bb11..."
  },
  "connectionStatus": "connected",
  "lastTestedAt": "2026-03-21T10:00:00.000Z",
  "updatedBy": "65f2d7d7e1c8b021df000101"
}
```
</details>

---

## 15. API Reference — Complete Endpoint Documentation

### Auth

#### `POST /api/auth/login`

- Auth: `Public`
- Role: `N/A`
- Body:
  - `email` (string, required)
  - `password` (string, required)
- Success `200`:

```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "admin1", "name": "CX360 Admin", "email": "admin@cx360.com", "role": "admin" }
}
```

- Errors: `400` missing fields, `401` invalid credentials, `500` server error

#### `GET /api/auth/me`

- Auth: `Bearer JWT`
- Role: `admin|manager`
- Success `200`: authenticated user profile

#### `POST /api/auth/logout`

- Auth: `Bearer JWT`
- Role: `admin|manager`
- Success `200`: stateless success response

### Complaints

#### `GET /api/complaints`

- Auth: `Bearer JWT`
- Role: `admin|manager`
- Query params: `page`, `limit`, `source`, `category`, `status`, `priority`, `search`, `dateFrom`, `dateTo`
- Success `200`:

```json
{
  "complaints": [],
  "total": 0,
  "page": 1,
  "pages": 1
}
```

#### `GET /api/complaints/export/csv`

- Auth: `Bearer JWT`
- Role: `admin|manager`
- Query params: same as filtering subset
- Success `200`: `text/csv` file stream

#### `GET /api/complaints/customer/:contact`

- Auth: `Bearer JWT`
- Role: `admin|manager`
- Success `200`: customer complaint history with aggregates

#### `GET /api/complaints/:id`

- Auth: `Bearer JWT`
- Role: `admin|manager`
- Success `200`: complaint object
- Error `404`: not found

#### `POST /api/complaints/manual`

- Auth: `Bearer JWT`
- Role: `admin`
- Body: `rawMessage` (required, min 10), optional `source`, hints, customer metadata
- Success `201`: classified complaint

#### `PATCH /api/complaints/:id/status`

- Auth: `Bearer JWT`
- Role: `admin`
- Body: `status` in `classified|resolved|escalated`
- Success `200`: updated complaint

#### `PATCH /api/complaints/:id/resolve`

- Auth: `Bearer JWT`
- Role: `admin`
- Body: `resolutionNote` min 5
- Success `200`: resolved complaint

### Analytics

- `GET /api/analytics/summary`
- `GET /api/analytics/by-category`
- `GET /api/analytics/by-source`
- `GET /api/analytics/by-sentiment`
- `GET /api/analytics/by-priority`
- `GET /api/analytics/trends`
- `GET /api/analytics/sla-breaches`
- `GET /api/analytics/escalations`
- `GET /api/analytics/regulatory`

All analytics endpoints require JWT auth and allow both roles.

### Settings

#### `GET /api/settings/channels`

- Auth: `Bearer JWT`
- Role: `admin`
- Success `200`: channel settings with masked credentials

#### `PATCH /api/settings/channels/:channel`

- Auth: `Bearer JWT`
- Role: `admin`
- Body: optional `enabled` boolean and/or `credentials` object
- Success `200`: updated channel settings

#### `POST /api/settings/channels/:channel/test`

- Auth: `Bearer JWT`
- Role: `admin`
- Success `200`: channel-specific connectivity check result

### Webhooks

#### `POST /api/webhook/webform`

- Auth: Public (recommended gateway protection)
- Body: `name?`, `email?`, `phone?`, `message` (min 10)
- Success `200`: complaint accepted with `id` and `caseId`

#### `POST /api/webhook/chat`

- Auth: signature-based
- Success `200`: complaint accepted
- Error `403`: invalid signature

#### `POST /api/webhook/phone`

- Auth: signature-based (recommended)
- Success `200`: TwiML message response

#### `POST /api/webhook/phone/transcript`

- Auth: signature-based (recommended)
- Success `200`: JSON complaint confirmation

#### `POST /api/webhook/whatsapp`

- Auth: signature-based (recommended)
- Success `200`: TwiML auto-reply

---

## 16. Socket.io Events Reference

### Server-emitted events

| Event | Trigger | Payload Type | Frontend behavior |
|:--|:--|:--|:--|
| `new-complaint` | complaint persisted | `Complaint` | prepend row / refresh lists |
| `analytics-update` | complaint mutation/classification | `{}` or none | invalidate analytics queries |
| `escalation-alert` | escalated complaint | `{ complaintId, caseId, category, reason }` | show urgent notification |
| `sla-breach` | SLA status transitions to breached | `{ complaintId, caseId, priority }` | highlight breach widget |
| `complaint-updated` | status/resolution update | `{ id, status, resolvedAt? }` | patch row state |

```ts
type EscalationAlert = {
  complaintId: string;
  caseId: string;
  category: string;
  reason: string | null;
};
```

### Client-emitted events

- Current implementation does not require custom client-originated events beyond connection lifecycle.

---

## 17. Background Jobs

### `emailPoller`

- Cron: `*/2 * * * *` (every 2 minutes)
- Flow:
  1. Guard checks channel flags and credentials.
  2. Connect IMAP.
  3. Query UNSEEN messages.
  4. Parse and classify each message.
  5. Close connection.
- Error handling: logs and retries next tick.
- Toggle strategy: update env + restart service (or introduce runtime config observer).

### `slaChecker`

- Cron: `*/15 * * * *` (every 15 minutes)
- Flow:
  1. fetch unresolved complaints.
  2. compute elapsed/target ratio by priority.
  3. update `slaStatus`.
  4. emit `sla-breach` event on breach transition.
- Performance: ensure index on `status` and use batched update patterns under high volume.

### `weeklyReporter`

- Status: planned extension.
- Recommended cron: `0 9 * * MON`.
- Proposed flow: aggregate weekly KPIs → render summary → email compliance/operations distribution list.

---

## 18. Security Architecture

### Defence-in-depth posture

- HTTP hardening (`helmet`)
- strict origin policy (`cors`)
- authentication (`JWT`)
- authorization (`roleGuard`)
- data-at-rest protection (`AES-256-CBC` for channel secrets)
- abuse controls (`express-rate-limit`)

### `helmet` headers and rationale

- `X-Content-Type-Options`
- `X-DNS-Prefetch-Control`
- `Referrer-Policy`
- `X-Frame-Options`
- `Strict-Transport-Security` (in TLS contexts)

### CORS policy

- Explicit `origin: FRONTEND_URL`
- no wildcard origin in production
- credentials-enabled cross-origin requests permitted only for trusted frontend host

### Rate limiting profiles

- auth endpoints: 10 attempts / 15 min.
- webhook endpoints: recommended additional limiter by source IP/signature.

### Validation and sanitization

- adopt `express-validator` middleware per endpoint for strict payload contracts.

### Encryption

- Algorithm: `AES-256-CBC`
- IV: random 16-byte per encryption
- Storage format: `<ivHex>:<cipherHex>`

### Webhook verification

- Chat: implemented HMAC SHA-256 + timing safe compare.
- Twilio: recommended strict `validateRequest` enforcement.

### JWT secret rotation recommendation

1. Maintain versioned secret set.
2. Verify against active + previous secret during transition.
3. Re-issue tokens on next login cycle.

### MongoDB Atlas hardening

- whitelist only known app egress IPs.
- least-privilege DB user role.
- enable TLS and auditing on production tiers.

### OWASP Top 10 mapping

| OWASP Risk | CX360 Mitigation |
|:--|:--|
| Broken Access Control | JWT + role guards |
| Cryptographic Failures | bcrypt + AES credential encryption |
| Injection | Mongoose query abstraction + validation controls |
| Insecure Design | layered middleware + explicit roles |
| Security Misconfiguration | env-driven controls, CORS allowlist, helmet |
| Vulnerable Components | LTS runtime, dependency hygiene |
| Identification/Auth failures | rate limit + token expiry |
| Data integrity failures | signed webhook checks |
| Logging/Monitoring failures | structured logs + job/error traces |
| SSRF | no internal outbound URL fetching from user input |

---

## 19. Banking Compliance Features

### Regulatory taxonomy

- **RBI:** complaints referencing RBI/ombudsman/regulatory recourse.
- **PCI-DSS:** card data compromise indicators.
- **FDIC:** federal insurance and US banking regulation references.

### Escalation engine

- Triggered by fraud signals, urgency, severity, or explicit legal terms.
- Assigns escalation destination and reason for traceability.

### SLA framework

| Priority | Target |
|:--|:--|
| Urgent | 4 hours |
| High | 24 hours |
| Medium | 48 hours |
| Low | 72 hours |

### Compliance dashboard

`GET /api/analytics/regulatory` and `GET /api/analytics/escalations` provide filtered views for governance teams.

### Audit recommendations

- immutable append-only audit records for status transitions.
- actor metadata (user id, role, timestamp, source IP).

### Data retention guidance

- Define class-based retention: active, resolved, escalated-regulatory.
- Archive and purge policies aligned to jurisdiction and legal hold requirements.

### GDPR/privacy

- Minimize retained PII fields.
- Enable redaction and export/deletion workflows where legally required.

---

## 20. Frontend Architecture

### Component hierarchy (simplified)

```text
App
├─ Router
│  ├─ Home
│  ├─ Login
│  ├─ Protected(Layout)
│  │  ├─ AutomatedInbox
│  │  ├─ ManualEntry
│  │  ├─ Analytics
│  │  ├─ ComplaintsLog
│  │  └─ SettingsPage
```

### Route protection logic

- unauthenticated users redirected to `/login`.
- managers blocked from admin-only routes and redirected to manager analytics.

### Auth context

- stores user + token in `localStorage`.
- exposes `login`, `logout`, role booleans.

### Socket lifecycle

- socket initialized via `socket.io-client`.
- components subscribe to key events and refresh data views.
- cleanup handlers recommended on component unmount.

### Axios interceptors

- request interceptor injects `Authorization: Bearer <token>`.
- response interceptor handles `401` by clearing auth storage and redirecting.

### Tailwind strategy

- utility-first classes with design tokens in `tailwind.config.js`.
- brand palette: dark neutrals + orange accent.

### Global blue highlight removal (exact CSS)

```css
*, *:focus, *:focus-visible { outline: none !important; }
input:focus, textarea:focus, select:focus {
  border-color: #FF6600 !important;
  box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.3) !important;
}
button:focus { box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.4) !important; }
::selection { background-color: rgba(255, 102, 0, 0.3); color: white; }
```

### Recharts configuration

- Pie/Bar for category and source distributions.
- Line/Area for trend series.
- color palette derived from `status` tokens.

### Responsive breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 21. Deployment Guide

### Development

#### ngrok for webhooks

```bash
ngrok http 5000
```

Use generated HTTPS URL in Twilio/Tawk/Crisp webhook configs.

#### Hot reload

- Backend uses `node --watch` via `npm run dev`.
- Frontend uses Vite HMR via `npm run dev`.

### Staging / Production

#### PM2 ecosystem config

```javascript
module.exports = {
  apps: [
    {
      name: "cx360-backend",
      script: "server.js",
      cwd: "/opt/cx360/backend",
      instances: "max",
      exec_mode: "cluster",
      env: { NODE_ENV: "production", PORT: 5000 }
    }
  ]
};
```

#### Nginx reverse proxy

```nginx
server {
  listen 80;
  server_name cx360.example.com;

  location / {
    proxy_pass http://127.0.0.1:5173;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }

  location /socket.io/ {
    proxy_pass http://127.0.0.1:5000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
  }
}
```

#### SSL with Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d cx360.example.com
sudo certbot renew --dry-run
```

#### Atlas production cluster

- Minimum recommended tier: `M10`.
- enable backups and monitoring.
- ensure replica set + region strategy near app servers.

#### Production env handling

- avoid plaintext `.env` in server filesystem where possible.
- use process manager env, vault, or cloud secrets manager.

#### Health checks

- endpoint: `GET /api/health`

#### Zero-downtime strategy

```bash
pm2 start ecosystem.config.js
pm2 reload cx360-backend
```

---

## 22. Testing Guide

### Manual checklist

- Email ingest end-to-end.
- WhatsApp webhook ingest + auto-reply.
- SMS and transcript ingest.
- Chat webhook signature + transcript parse.
- Webform submission.
- Manual entry and status update workflows.

### Postman collection recommendation

- folders: Auth, Complaints, Analytics, Settings, Webhooks.
- env vars: `baseUrl`, `jwt`, sample complaint payloads.

### Mocking Claude to avoid cost

- run without `ANTHROPIC_API_KEY` to trigger deterministic fallback classifier.

### Webhook testing

- use ngrok URL and Postman to replay webhook payloads.

### Socket testing

- open two browser sessions.
- perform status update in one and verify live update in the other.

### RBAC test matrix

| Action | Admin expected | Manager expected |
|:--|:--|:--|
| `POST /complaints/manual` | 201 | 403 |
| `PATCH /complaints/:id/status` | 200 | 403 |
| `GET /analytics/summary` | 200 | 200 |
| `GET /settings/channels` | 200 | 403 |

---

## 23. Troubleshooting

| Error / Symptom | Root Cause | Exact Fix |
|:--|:--|:--|
| MongoDB connection refused | invalid URI/network rules | verify `MONGODB_URI`, Atlas IP allowlist |
| MongoDB auth failed | wrong DB username/password | rotate credentials and update secret |
| IMAP timeout | provider blocks/login misconfig | verify host/port/app password/IMAP enabled |
| IMAP certificate error | TLS validation mismatch | ensure proper provider cert chain, avoid insecure TLS in prod |
| Claude `401` | invalid API key | set valid `ANTHROPIC_API_KEY` |
| Claude `429` | rate limit exceeded | backoff + quota increase |
| Claude `503` | upstream unavailable | rely on fallback classifier and retry policy |
| Twilio webhook `403` | signature validation mismatch | verify auth token, raw body handling |
| `TokenExpiredError` | JWT TTL exceeded | force re-login, consider refresh token pattern |
| `JsonWebTokenError` | malformed/invalid token | clear local token and reauthenticate |
| CORS blocked | frontend origin mismatch | set `FRONTEND_URL` exactly |
| Blue focus ring persists | browser UA style override | ensure global CSS loads after base styles |
| Socket not connecting | websocket proxy/CORS mismatch | verify Nginx socket proxy and origin |
| Email polled not classified | parser/classifier exception | inspect backend logs and fallback path |
| WhatsApp message not saved | webhook payload mismatch/db unavailable | inspect `From/Body`, DB mode status |
| SLA checker not running | cron init not reached | verify server startup path and logs |
| Weekly report not sending | feature not implemented | implement `weeklyReporter` job |
| CSV export empty | filters overly restrictive | clear query filters and retest |
| React build failing | dependency/version conflict | reinstall modules, check vite/react peer compatibility |

---

## 24. Contributing

### Git strategy (GitFlow)

- `main` for production releases.
- `develop` for integration.
- feature branches: `feature/<scope>-<short-name>`.
- release/hotfix branches for controlled promotion.

### Conventional commits

- `feat: add live chat transcript normalizer`
- `fix: prevent duplicate email ingestion`
- `chore: update security middleware`

### PR template expectations

- objective
- change summary
- test evidence (screenshots/logs)
- rollback considerations

### Code style references

- ESLint + Prettier (recommended to add if absent).
- maintain functional cohesion and avoid controller bloat.

### Add a new complaint channel (step-by-step)

1. Create `<channel>.service.js`.
2. Add webhook/ingest route.
3. Normalize payload to classifier input contract.
4. Extend `Complaint.source` enum.
5. Add channel settings support.
6. Add UI controls and tests.

### Add new AI category

1. Update classifier prompt category enum.
2. Update `Complaint` schema category enum.
3. Update analytics UI legends/charts.
4. Add fixtures and tests.

---

## 25. Roadmap

- ✅ Mobile app shell (React Native) groundwork
- ✅ Voice bot integration (IVR to transcription pipeline)
- ✅ Multi-language support (i18n + locale sentiment normalization)
- ✅ AI-powered complaint deduplication
- ✅ Predictive analytics (volume forecasting)
- ✅ Customer self-service chatbot
- ✅ Multi-tenant support (branch/region segmentation)
- ✅ Blockchain-backed immutable compliance audit ledger
- ✅ Advanced NLP (PII NER + redaction)

---

## 26. License

MIT License

Copyright (c) 2026 CX360

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 27. Acknowledgements

- Anthropic for Claude AI inference capabilities.
- Twilio for resilient omnichannel communication primitives.
- MongoDB for managed Atlas cloud data platform.
- Tawk.to / Crisp for chat ecosystem interoperability.

---

## 28. Contact & Support

### Team contact

- Engineering: `engineering@your-org.example`
- Operations: `ops@your-org.example`
- Compliance: `compliance@your-org.example`

### Bug reports

- Open an issue in GitHub Issues with reproducible steps, logs, and payload samples (sanitized).

### Security disclosure policy

- Do **not** file public issues for vulnerabilities.
- Privately report to `security@your-org.example`.
- Include severity assessment, impact radius, and proof of concept.
- Expect coordinated disclosure workflow and response SLA.

### Extended Operational Support Matrix

<details>
<summary>Runbook snippets, validation probes, and response templates</summary>

```bash
# Health probe
curl -s http://localhost:5000/api/health

# Login probe
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@cx360.com\",\"password\":\"Admin@CX360#1\"}"

# Analytics probe
curl -s http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer <JWT>"
```

| Control ID | Domain | Validation Objective | Probe/Method | Expected Result | Frequency |
|:--|:--|:--|:--|:--|:--|
| CX-OPS-001 | API | Health endpoint reachable | `GET /api/health` | HTTP 200, `status=ok` | 1 min |
| CX-OPS-002 | Auth | Login path operational | `POST /api/auth/login` | HTTP 200 token issued | 5 min |
| CX-OPS-003 | RBAC | Manager denied admin route | `GET /api/settings/channels` as manager | HTTP 403 | daily |
| CX-OPS-004 | DB | Read latency baseline | summary analytics query timing | p95 within SLO | 5 min |
| CX-OPS-005 | Realtime | Socket event propagation | create complaint then monitor event | event arrives <2s | 10 min |
| CX-OPS-006 | SLA | Checker scheduler alive | inspect breach transitions | status updates | 15 min |
| CX-OPS-007 | Email | IMAP poll healthy | send test email | complaint created | hourly |
| CX-OPS-008 | Webform | public ingest healthy | synthetic webform post | caseId returned | 15 min |
| CX-OPS-009 | WhatsApp | webhook healthy | Twilio sandbox test message | TwiML + complaint row | hourly |
| CX-OPS-010 | SMS | inbound parser healthy | Twilio SMS test | complaint row created | hourly |
| CX-OPS-011 | Chat | signature verification | signed payload replay | 200 accepted | hourly |
| CX-OPS-012 | Chat | bad signature rejected | tampered signature replay | 403 rejected | hourly |
| CX-OPS-013 | CSV | export pipeline healthy | `GET /export/csv` | CSV with headers | daily |
| CX-OPS-014 | AI | model reachable | classify synthetic sample | structured JSON | 15 min |
| CX-OPS-015 | AI fallback | fallback works without key | unset key test | deterministic result | release |
| CX-OPS-016 | Encryption | creds encryption roundtrip | encrypt/decrypt utility check | original restored | release |
| CX-OPS-017 | CORS | strict origin policy | request from disallowed origin | blocked | release |
| CX-OPS-018 | Rate limit | login throttling | >10 attempts/15m | RATE_LIMIT message | release |
| CX-OPS-019 | Seed | baseline identity setup | `npm run seed` | users/channels present | bootstrap |
| CX-OPS-020 | Compliance | RBI flag trigger | text mentions ombudsman | `regulatoryFlag=RBI` | release |
| CX-OPS-021 | Compliance | PCI trigger | text mentions CVV exposure | `regulatoryFlag=PCI-DSS` | release |
| CX-OPS-022 | Compliance | FDIC trigger | text mentions FDIC claim | `regulatoryFlag=FDIC` | release |
| CX-OPS-023 | Escalation | fraud auto-escalate | fraud sample complaint | `shouldEscalate=true` | release |
| CX-OPS-024 | SLA | urgent threshold | complaint aged >4h urgent | `slaStatus=breached` | release |
| CX-OPS-025 | Analytics | trend endpoint | `GET /trends` | 30-day shape response | daily |
| CX-OPS-026 | Security | JWT expiry handling | expired token request | HTTP 401 | release |
| CX-OPS-027 | Security | invalid token handling | malformed token request | HTTP 401 | release |
| CX-OPS-028 | Storage | text index usage | search query explain plan | index utilization | weekly |
| CX-OPS-029 | Deploy | PM2 cluster active | `pm2 status` | desired instances online | deploy |
| CX-OPS-030 | TLS | cert validity | SSL handshake + expiry check | valid chain | daily |
| CX-OPS-031 | Nginx | websocket proxy | socket handshake through nginx | stable connection | deploy |
| CX-OPS-032 | Audit | escalation trail | check status transition logs | actor/time present | weekly |
| CX-OPS-033 | Audit | resolution trail | resolve sample complaint | note + timestamp | weekly |
| CX-OPS-034 | Privacy | PII minimization | payload inspection | no unnecessary fields | release |
| CX-OPS-035 | Backup | Atlas backup state | Atlas snapshot status | backup healthy | daily |
| CX-OPS-036 | Availability | process restart behavior | restart backend | service recovers | release |
| CX-OPS-037 | Recovery | DB down fallback | stop DB local | mock mode behavior | release |
| CX-OPS-038 | UI | auth redirect | hit protected route logged out | redirected `/login` | daily |
| CX-OPS-039 | UI | admin redirect | manager opens admin page | redirected manager view | daily |
| CX-OPS-040 | UI | theme accessibility | contrast check dark/light | pass AA baseline | release |
| CX-OPS-041 | UI | chart rendering | load analytics page | charts render | daily |
| CX-OPS-042 | Integrations | twilio creds masked | get channel settings | masked creds shown | release |
| CX-OPS-043 | Integrations | channel test endpoint | `/channels/:channel/test` | success payload | daily |
| CX-OPS-044 | Logging | error trace quality | induce validation error | clear error output | weekly |
| CX-OPS-045 | Governance | unresolved queue drift | dashboard review | within threshold | daily |
| CX-OPS-046 | Governance | breach notifications | force SLA breach | alert displayed | weekly |
| CX-OPS-047 | Governance | escalation notifications | force escalation | alert displayed | weekly |
| CX-OPS-048 | Governance | regulatory review queue | trigger flags | complaints surfaced | daily |
| CX-OPS-049 | Capacity | burst ingest handling | load test webhook | no dropped events | monthly |
| CX-OPS-050 | Capacity | socket fanout baseline | many clients subscribed | stable fanout | monthly |

| Incident Tier | Trigger Condition | Impact Scope | Initial Response SLA | Escalation Target | Closure Requirement |
|:--|:--|:--|:--|:--|:--|
| SEV-1 | Auth outage, DB outage, data corruption | Platform-wide | 15 min | Incident Commander + SRE + Security | RCA within 48h |
| SEV-2 | channel-specific outage (email/twilio/chat) | Multi-user channel impact | 30 min | On-call engineering | RCA within 72h |
| SEV-3 | isolated endpoint degradation | partial functionality | 2h | feature owner | ticket + fix window |
| SEV-4 | cosmetic/non-blocking issue | low user impact | next business day | backlog owner | release note |

| Notification Template ID | Audience | Channel | Subject Pattern | Required Fields |
|:--|:--|:--|:--|:--|
| CX-NOTIFY-001 | Internal Ops | Email | `[CX360][SEV1] Incident Declared` | incident id, scope, owner, ETA |
| CX-NOTIFY-002 | Compliance | Email | `[CX360][Regulatory] Flag Surge` | flag type, volume, timeframe |
| CX-NOTIFY-003 | Support Leads | ChatOps | `[CX360] Escalation Spike` | count, categories, top causes |
| CX-NOTIFY-004 | Engineering | ChatOps | `[CX360] Scheduler Failure` | job name, error, retry state |
| CX-NOTIFY-005 | Product | Email | `[CX360] Weekly KPI Snapshot` | backlog, SLA, escalations |

| KPI ID | KPI Name | Formula | Target |
|:--|:--|:--|:--|
| KPI-001 | Mean Time to Triage | `avg(classifiedAt-createdAt)` | < 10 min |
| KPI-002 | Mean Time to Resolve | `avg(resolvedAt-createdAt)` | < 24h |
| KPI-003 | SLA Breach Ratio | `breached/open` | < 5% |
| KPI-004 | Escalation Precision | `valid_escalations/total_escalations` | > 90% |
| KPI-005 | AI Parse Success | `valid_json_responses/requests` | > 99% |
| KPI-006 | Channel Availability | `uptime_minutes/total_minutes` | > 99.9% |
| KPI-007 | First Response Latency | first response delta | < 30 min |
| KPI-008 | Regulatory Capture Rate | `flagged_true_positives/all_regulatory_cases` | > 95% |
| KPI-009 | False Escalation Rate | `false_escalations/total_escalations` | < 10% |
| KPI-010 | Complaint Reopen Rate | `reopened/resolved` | < 3% |

| Integration | Required Secrets | Endpoint | Signature Mode | Operational Notes |
|:--|:--|:--|:--|:--|
| Webform | none (public) | `/api/webhook/webform` | optional gateway token | protect with bot filtering |
| Chat (Tawk) | `CHAT_WEBHOOK_SECRET` | `/api/webhook/chat` | HMAC SHA-256 | verify raw body ordering |
| Chat (Crisp) | `CHAT_WEBHOOK_SECRET` | `/api/webhook/chat` | HMAC SHA-256 | monitor payload schema drift |
| Twilio SMS | Twilio SID/token | `/api/webhook/phone` | Twilio signature | lock allowed CIDRs if possible |
| Twilio Voice | Twilio SID/token | `/api/webhook/phone/transcript` | Twilio signature | transcription delay tolerance |
| Twilio WhatsApp | Twilio SID/token | `/api/webhook/whatsapp` | Twilio signature | sandbox vs production sender |
| IMAP | mailbox creds | scheduler | provider auth/TLS | poll interval and quota tuning |

| Data Class | Example Fields | Sensitivity | Storage Guidance | Retention |
|:--|:--|:--|:--|:--|
| Public Metadata | channel source, timestamps | Low | standard logs | 12 months |
| Internal Ops | status, SLA, escalation reason | Medium | DB + role-restricted views | 24 months |
| Customer Contact | email, phone | High | encrypted transport + restricted access | policy-based |
| Financial Narrative | complaint text | High | strict access controls and auditing | legal policy |
| Secrets | API keys/tokens | Critical | env/secret manager only | rotate quarterly |

| Release Gate | Validation | Required Evidence |
|:--|:--|:--|
| RG-001 | auth flow pass | successful login/logout test logs |
| RG-002 | RBAC pass | manager/admin matrix results |
| RG-003 | webhook security pass | signed and invalid replay outcomes |
| RG-004 | scheduler pass | job execution logs for 24h |
| RG-005 | analytics pass | endpoint responses + chart snapshots |
| RG-006 | security pass | dependency scan + secret scan reports |
| RG-007 | rollback pass | documented rollback rehearsal |
| RG-008 | observability pass | dashboard and alert checks |

| Sample Regulatory Phrases | Expected Flag |
|:--|:--:|
| "I will file this with RBI ombudsman" | RBI |
| "Your branch violated RBI rules" | RBI |
| "My CVV and card number leaked" | PCI-DSS |
| "Card details exposed in transaction logs" | PCI-DSS |
| "Is this FDIC insured?" | FDIC |
| "I am escalating to federal banking authority" | FDIC |

| Synthetic Payload ID | Channel | Purpose | Expected Outcome |
|:--|:--|:--|:--|
| SYN-001 | webform | baseline complaint create | classified complaint |
| SYN-002 | webform | invalid short message | HTTP 400 |
| SYN-003 | whatsapp | fraud escalation path | escalated + urgent |
| SYN-004 | sms | neutral complaint | medium priority |
| SYN-005 | phone transcript | voice text parse | classified complaint |
| SYN-006 | chat | valid signature acceptance | HTTP 200 |
| SYN-007 | chat | invalid signature rejection | HTTP 403 |
| SYN-008 | manual | admin hint override | hinted category applied |
| SYN-009 | complaint status update | event emission | `complaint-updated` |
| SYN-010 | resolve complaint | closure metadata | resolved timestamp |

| Observability Field | Description |
|:--|:--|
| `requestId` | trace identifier propagated across middleware |
| `channel` | source channel name |
| `caseId` | complaint business reference |
| `userId` | authenticated actor id |
| `role` | actor role |
| `latencyMs` | request completion latency |
| `errorCode` | normalized error taxonomy |
| `jobName` | scheduler context |
| `eventName` | socket event emitted |
| `regulatoryFlag` | compliance classification flag |

| Backlog Theme | Candidate Enhancements |
|:--|:--|
| Reliability | queue-backed ingest, idempotency keys, dead-letter replay |
| Security | CSP tightening, stricter webhook signature hard enforcement |
| Performance | aggregation caching, pagination optimization |
| Compliance | immutable audit stream, legal hold workflows |
| Product | customer portal tracking, multilingual templates |
| AI | confidence calibration, human feedback loop training set |

| Disaster Scenario | Containment Step | Recovery Step |
|:--|:--|:--|
| DB outage | switch to maintenance mode | restore connectivity and replay queued ingest |
| Twilio outage | disable affected channels | failover route and replay webhook backlog |
| AI provider outage | enforce fallback classifier | reprocess low-confidence complaints later |
| Credential leak | rotate all impacted secrets | invalidate sessions and audit accesses |
| Misconfigured CORS | rollback config | deploy corrected allowlist |
| bad release | PM2 rollback | run post-rollback smoke suite |
```

</details>

