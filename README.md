# BHAUS

> 🏠 **BHAUS** (Boarding House Management System) is a modern monorepo powering tenant and landlord workflows for onboarding, billing, and house management.

![BHAUS Logo Placeholder](./apps/mobile/assets/images/logo-placeholder.png)

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?logo=nestjs&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-Mobile-000020?logo=expo&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-Workspace-F69220?logo=pnpm&logoColor=white)

## Branding

- App Name: **BHAUS**
- Primary Color: `#00978A`
- Typography: Inter (body), Poppins (display/branding)

## Monorepo Structure

```text
bhaus/
├── apps/
│   ├── mobile/          # Expo app (Tenant + Landlord)
│   └── api/             # NestJS API + Prisma
├── packages/
│   ├── ui/              # Shared React Native design system
│   ├── types/           # Shared TypeScript enums and interfaces
│   └── utils/           # Shared formatters and helper functions
├── .github/workflows/   # CI and deployment automation
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (Supabase-ready)
- Redis (Upstash-ready)

### Install

```bash
pnpm install
```

### Environment Setup

Copy and fill API environment variables:

```bash
cp apps/api/.env.example apps/api/.env
```

### Run Development

```bash
pnpm dev
```

### Useful Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter api prisma:generate
```

## Phase Roadmap

- ✅ Phase 1: Monorepo foundation, shared packages, API auth + house + tenants foundations, Expo routing and auth flow screens
- 🔜 Phase 2: Billing engine, queues/jobs, notifications, payment workflows, media/chat enhancements
- 🔜 Phase 3: Production hardening, analytics, payment gateways (GCash/QR/Credit Card), observability

## Contributing

Contributing guide will be added in a future update. For now, please open an issue before major structural changes.
