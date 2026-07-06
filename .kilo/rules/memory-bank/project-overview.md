# Project Overview - UyuniAdmin Frontend

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Uyuni Frontend (UyuniAdmin) |
| **Version** | 1.0.3 |
| **Type** | Enterprise Admin Dashboard |
| **Framework** | Angular v21.2.17 (Standalone Components) |
| **Status** | Production Ready |
| **Last Major Update** | May 2026 |

## Purpose

UyuniAdmin is an enterprise-grade administrative dashboard designed for managing complex business operations. It provides a comprehensive UI for user management, authentication, data visualization, and administrative tasks.

## Key Features

- **Authentication System**: OAuth2 Password Grant with JWT tokens
- **Role-Based Access Control**: Multi-role user management with context switching
- **Dashboard Analytics**: E-commerce metrics, sales charts, and role-based views
- **Staff Management**: Staff list with filtering and search (/staff)
- **User Management**: User list with filtering and search (/users)
- **User Profile**: Profile management with role selection

## Target Users

- System Administrators
- Business Analysts
- Data Entry Operators
- Management Personnel

## Deployment

- **Environment**: Web-based application
- **Backend Integration**: RESTful API with JWT authentication
- **Offline Support**: Self-hosted fonts for offline capability

## Project Structure

```
src/app/
├── core/           # Global singleton services
├── shared/         # Reusable UI components
├── features/       # Feature modules (lazy-loaded)
└── app.config.ts   # Application configuration
```

## Documentation

- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) - Architecture guide
- [`docs/AUTHENTICATION.md`](../docs/AUTHENTICATION.md) - Authentication system
- [`docs/ENTERPRISE_ARCHITECTURE.md`](../docs/ENTERPRISE_ARCHITECTURE.md) - Enterprise patterns
- [`docs/DEPLOYMENT_GUIDE.md`](../docs/DEPLOYMENT_GUIDE.md) - Deployment instructions
- [`GEMINI.md`](../GEMINI.md) - AI context file
- [`AGENTS.md`](../AGENTS.md) - AI agents unified context

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

*Last updated: July 2026*
