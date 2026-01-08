# Global Commerce OS

## Overview

A full-stack commerce management platform for international product rollout and automation. The application provides a dashboard for managing products, global regions/markets, and automation rules with Shopify integration capabilities.

The system enables:
- Multi-region product catalog management
- International market rollout tracking (planned/beta/live status)
- Automation rules for commerce workflows (order events, inventory alerts)
- Analytics dashboard with performance visualization

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for data visualization

The frontend follows a pages-based structure with shared components. Custom hooks abstract API calls (`use-regions`, `use-products`, `use-automation`). The UI uses a Polaris-inspired design system with CSS variables for theming.

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Design**: REST endpoints with Zod schema validation
- **Build**: Vite for development, esbuild for production bundling

The backend serves both the API and static frontend assets. Route definitions are centralized in `shared/routes.ts` with input/output schemas for type safety across the stack.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation generation
- **Schema Location**: `shared/schema.ts` (shared between frontend/backend)

Core entities:
- `regions` - International markets with rollout status
- `products` - Product catalog with Shopify sync metadata
- `automationRules` - Configurable workflow triggers and actions

### API Structure
All endpoints prefixed with `/api/`:
- `GET/POST /api/regions` - Region CRUD
- `GET/POST /api/products` - Product CRUD with optional region filtering
- `GET/POST/PATCH /api/automation` - Automation rule management with toggle support

Shared route definitions in `shared/routes.ts` provide type-safe API contracts using Zod schemas.

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Connection pooling with `pg` package
- Schema migrations via `drizzle-kit push`

### Third-Party Services (Prepared for Integration)
- **Shopify**: Product sync structure ready (`shopifyId` field on products)
- **Stripe**: Listed in build allowlist for future payment integration

### Development Tools
- Vite dev server with HMR
- Replit-specific plugins for error overlay and dev banners
- TypeScript with path aliases (`@/` for client, `@shared/` for shared code)