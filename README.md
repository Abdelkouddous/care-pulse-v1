<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="Next.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/-Backend_Agnostic-black?style=for-the-badge&logoColor=white&logo=code&color=555555" alt="Backend-agnostic" />
  </div>

## 📋 Table of Contents

1. 🏥 [Introduction](#introduction)
2. 🛠️ [Tech Stack](#tech-stack)
3. 💡 [Features](#features)
4. 🚦 [Quick Start](#quick-start)
5. 📁 [Project Structure](#structure)
6. 📞 [Contact](#contact)

## <a name="introduction">🏥 Introduction</a>

**Pulse Pro** is an enterprise-grade healthcare management system developed by Vital Soft to modernize medical practice operations. Built on cutting-edge technology, this platform offers:

- Patient relationship management (PRM)
- AI-powered appointment scheduling
- Real-time health monitoring integration
- Blockchain-based medical records
- Telemedicine capabilities

**[Vital Soft](https://vitalsoft.com)** specializes in developing secure, scalable healthcare solutions that comply with HIPAA and GDPR regulations.

## <a name="tech-stack">🛠️ Tech Stack</a>

- **Core Framework**: Next.js 14 (App Router)
- **State Management**: Zustand
- **Database**: Backend-agnostic adapter (lib/db.ts) with planned Railway Postgres
- **UI/UX**: Tailwind CSS + ShadCN
- **Authentication**: Placeholder OTP + TokenManager (backend-agnostic)
- **Monitoring**: Sentry (optional)
- **CI/CD**: GitHub Actions + Docker
- **DEPLOYMENT**: AWS + Vercel

## <a name="features">💡 Key Features</a>

✅ **Advanced Patient Portal**

- Biometric authentication
- Medical history timeline
- Prescription management
- Insurance verification API integration

✅ **Smart Scheduling System**

- AI-powered appointment recommendations
- Automated conflict detection
- Multi-channel notifications (SMS/Email/WhatsApp)

✅ **Clinical Decision Support**

- Symptom checker with ML integration
- Drug interaction alerts
- Treatment protocol suggestions

✅ **Analytics Dashboard**

- Real-time practice metrics
- Patient flow optimization
- Financial reporting
- Customizable KPI tracking

✅ **Enterprise Security**

- End-to-end encryption
- Audit logging
- Role-based access control
- Regular penetration testing

## <a name="quick-start">🚦 Quick Start</a>

**Prerequisites**

- Node.js 18+ (no external backend required in placeholder mode)

**1. Clone Repository**

```bash
git clone https://github.com/vitalsoft/Pulse-pro.git
cd Pulse-pro
```

**2. Install Dependencies**

````
```bash
npm install
````

**3. Configure Environment**

```env
# .env.local

# Enable MOCK MODE (in-memory data)
# Use either flag; NEXT_PUBLIC_ is available to client and server, MOCK_MODE is server-only
NEXT_PUBLIC_MOCK_MODE=true
# or
MOCK_MODE=true

# When ready to use a real backend, set MOCK MODE to false:
# NEXT_PUBLIC_MOCK_MODE=false
# MOCK_MODE=false
# Then implement lib/db.real.ts with Railway/Postgres logic.
```

**4. Run Development Server**

```bash
npm run dev
```

## <a name="structure">📁 Project Structure</a>

```bash
├── app/
│   ├── (auth)/          # Authentication flows
│   ├── (portal)/        # Patient/Doctor portals
│   ├── admin/           # Practice management
│   └── api/             # Backend endpoints
├── components/          # Reusable UI components
├── lib/                 # Core business logic
│   ├── analytics/       # Reporting tools
│   ├── ai/              # ML models
│   └── security/        # Encryption modules
├── types/               # TypeScript definitions
└── public/              # Static assets
```

## <a name="contact">📞 Contact</a>

**Vital Soft Development Team**
✉️ [contact@vitalsoft.com](mailto:contact@vitalsoft.com)
🌍 [https://vitalsoft.com](https://vitalsoft.com)

**Hamel Aymen**
💼 [LinkedIn](https://linkedin.com/in/aymenehamel)
🐙 [GitHub](https://github.com/aymenehamel)

<div align="center" style="margin-top: 40px;">
  <sub>Built with ❤️ by Vital Soft · © 2026 All rights reserved</sub>
</div>
