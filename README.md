# 🏥 SANITIO Backend

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](#license)

**Enterprise Healthcare Management System**  
Real-time patient and equipment tracking, vital signs monitoring, and alert management

[Documentation](#documentation) • [Installation](#installation) • [API Reference](#api-reference) • [Architecture](#architecture)

</div>

---

## 📋 Overview

**SANITIO** is a comprehensive healthcare management platform designed for hospitals and medical facilities. The backend service provides real-time tracking of patients and medical equipment, continuous vital signs monitoring, intelligent alert management, and advanced reporting capabilities.

### Key Features

- 🏥 **Patient Management** - Admission, discharge, positioning, medical records
- 📊 **Vital Signs Monitoring** - Real-time tracking with anomaly detection
- ⚙️ **Equipment Tracking** - RFID-based localization and maintenance scheduling
- 📍 **Location Management** - Zone-based occupancy and access control
- 🚨 **Intelligent Alerts** - Multi-severity alert system with 25+ trigger types
- 📬 **Multi-channel Notifications** - Email, SMS, Push, WebSocket
- 📈 **Advanced Analytics** - Custom reports, KPIs, trend analysis
- 🔐 **Enterprise Security** - JWT authentication, role-based access, activity logging
- 🔄 **Event-Driven Architecture** - Kafka messaging, WebSocket real-time updates
- 📱 **RESTful API** - Production-ready, well-documented endpoints

---

## 🛠️ Technology Stack

### Core Framework
- **NestJS 10.x** - Progressive Node.js framework
- **TypeScript 5.x** - Type-safe development
- **Node.js 18.x+** - Runtime environment

### Database & ORM
- **PostgreSQL 15.x** - Primary relational database
- **TypeORM** - Database ORM with migrations
- **Supabase** - Backend-as-a-Service (optional)

### Message & Real-time Communication
- **Kafka** - Event streaming and message queue
- **WebSocket** - Real-time client communications
- **Socket.io** - WebSocket server

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **bcrypt** - Password hashing
- **2FA/TOTP** - Two-factor authentication

### Monitoring & Logging
- **Winston** - Structured logging
- **Custom Interceptors** - Request/response logging
- **Activity Logs** - Audit trail

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.0
- **npm** >= 9.0
- **PostgreSQL** >= 15.0
- **Docker** (optional, for containerization)
- **Git** >= 2.30

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/sanito-backend.git
cd sanito-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
APP_PORT=3000
APP_NAME=SANITIO
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=sanitio_dev
DB_SYNCHRONIZE=false

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE_IN=24h
JWT_REFRESH_EXPIRE_IN=7d

# Email (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Kafka (Optional)
KAFKA_BROKERS=localhost:9092
KAFKA_GROUP_ID=sanitio-service

# Supabase (Optional)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Step 4: Database Setup

```bash
# Run migrations
npm run migration:run

# Seed data (optional)
npm run seed:run
```

---

## 📦 Project Structure

```
sanito-backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── enums/           # Application enums
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards
│   │   ├── interceptors/    # Request/response interceptors
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── pipes/           # Validation pipes
│   │   └── utils/           # Helper utilities
│   ├── config/              # App configuration
│   ├── database/            # Database setup
│   │   ├── config/          # TypeORM config
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/         # Database seeders
│   ├── modules/             # Feature modules (18 total)
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── patients/        # Patient management
│   │   ├── vital-signs/     # Vital signs monitoring
│   │   ├── equipment/       # Equipment management
│   │   ├── locations/       # Location management
│   │   ├── rfid/            # RFID tracking
│   │   ├── alerts/          # Alert management
│   │   ├── notifications/   # Notification service
│   │   ├── activity-log/    # Audit logs
│   │   ├── schedules/       # Staff schedules
│   │   ├── reports/         # Analytics & reports
│   │   ├── equipment-maintenance/ # Maintenance
│   │   ├── prescriptions/   # Medication management
│   │   ├── medical-records/ # Patient records
│   │   ├── kafka/           # Message queue
│   │   ├── events/          # WebSocket events
│   │   ├── supabase/        # BaaS integration
│   │   └── shared/          # Cross-module utilities
│   ├── app.controller.ts    # Root controller
│   ├── app.module.ts        # Root module
│   ├── app.service.ts       # Root service
│   └── main.ts              # Application entry
├── test/                    # E2E tests
├── .env.example             # Environment template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── nest-cli.json            # NestJS config
└── README.md                # This file
```

---

## 🏗️ Architecture

### Module Organization

The application is organized into **18 specialized modules**, each handling a specific domain:

```
User Layer
    ↓
Controllers (HTTP endpoints)
    ↓
Services (Business logic)
    ↓
Repositories (Data access)
    ↓
Database (PostgreSQL)
```

### Data Flow

```
Request
  ↓
Guard (Authentication/Authorization)
  ↓
Controller (Route handling)
  ↓
Service (Business logic, validation)
  ↓
Repository (Database queries)
  ↓
Response (Formatted output)
```

### Event Architecture

```
Kafka Message Queue
  ↓
Event Handlers (RFID scans, alerts, etc.)
  ↓
Service Logic & Database Updates
  ↓
WebSocket Events (Real-time updates)
  ↓
Client Applications
```

---

## 🎯 Core Modules

### Authentication & Users (8 modules)
- **Auth** - JWT tokens, 2FA, password reset
- **Users** - Profile management, roles, permissions

### Healthcare Management (5 modules)
- **Patients** - Admission, discharge, positioning
- **Vital Signs** - Monitoring, anomaly detection
- **Medical Records** - Document storage, history

### Equipment & Facilities (4 modules)
- **Equipment** - Tracking, maintenance scheduling
- **Equipment Maintenance** - Preventive maintenance
- **Locations** - Zone management, occupancy
- **RFID** - Tag assignment, movement tracking

### Operations (4 modules)
- **Alerts** - 25+ alert types with severity levels
- **Notifications** - Multi-channel delivery
- **Activity Log** - Comprehensive audit trail
- **Schedules** - Staff scheduling, conflict detection

### Business Intelligence (3 modules)
- **Reports** - Analytics and KPIs
- **Prescriptions** - Medication management
- **Events** - Real-time WebSocket updates

### Infrastructure (3 modules)
- **Kafka** - Message queue and event streaming
- **Supabase** - Optional BaaS integration
- **Shared** - Cross-module utilities

---

## 🚀 Getting Started

### Development Mode

```bash
# Watch mode with auto-restart
npm run start:dev

# Serve application at http://localhost:3000
# Hot-reload enabled
# Debug mode available
```

### Production Build

```bash
# Compile TypeScript to JavaScript
npm run build

# Start production server
npm run start:prod

# Run with PM2 (recommended)
pm2 start dist/main.js --name "sanitio"
```

### Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 📚 API Reference

### Authentication Endpoints

```http
POST /auth/register
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
POST /auth/verify-token
POST /auth/change-password
POST /auth/reset-password
POST /auth/enable-2fa
POST /auth/verify-2fa
```

### Patient Management

```http
GET    /patients                    # List all patients
POST   /patients                    # Create new patient
GET    /patients/:id                # Get patient details
PUT    /patients/:id                # Update patient
DELETE /patients/:id                # Delete patient
POST   /patients/:id/admit          # Admit patient
POST   /patients/:id/discharge      # Discharge patient
GET    /patients/:id/vital-history  # Get vital signs history
GET    /patients/:id/position       # Get position history
```

### Equipment Management

```http
GET    /equipment                   # List equipment
POST   /equipment                   # Create equipment
GET    /equipment/:id               # Get equipment details
PUT    /equipment/:id               # Update equipment
DELETE /equipment/:id               # Delete equipment
GET    /equipment/missing           # List missing equipment
GET    /equipment/:id/maintenance   # Get maintenance schedule
GET    /equipment/:id/history       # Get position history
```

### Vital Signs & Monitoring

```http
POST   /vital-signs                 # Record vital signs
GET    /vital-signs/patient/:id     # Get patient vitals
GET    /vital-signs/:id/latest      # Get latest readings
GET    /vital-signs/anomalies       # Detect anomalies
GET    /vital-signs/averages        # Calculate averages
```

### Alerts & Notifications

```http
GET    /alerts                      # List all alerts
GET    /alerts/:id                  # Get alert details
POST   /alerts/acknowledge          # Acknowledge alert
POST   /alerts/resolve              # Resolve alert
GET    /alerts/by-type/:type        # Filter by type
GET    /alerts/by-severity/:level   # Filter by severity
POST   /notifications/send-email    # Send email
POST   /notifications/send-sms      # Send SMS
POST   /notifications/send-push     # Send push notification
```

### Reports & Analytics

```http
GET    /reports/dashboard           # Get dashboard KPIs
GET    /reports/patients            # Patient statistics
GET    /reports/equipment           # Equipment statistics
GET    /reports/alerts              # Alert trends
GET    /reports/occupation          # Zone occupancy
GET    /reports/export-pdf          # Export PDF report
GET    /reports/export-excel        # Export Excel report
```

### Schedules & Locations

```http
GET    /locations                   # List locations
GET    /locations/:id/occupancy     # Get occupancy status
GET    /schedules                   # List schedules
GET    /schedules/conflicts         # Check conflicts
GET    /schedules/:userId/availability # Get availability
```

### Activity Log

```http
GET    /activity-log                # View audit logs
GET    /activity-log/user/:userId   # User activity
GET    /activity-log/entity/:type   # Entity changes
```

---

## 🔌 Real-time WebSocket Events

### Connection

```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'jwt_token' }
});
```

### Subscriptions

```javascript
// Patient updates
socket.on('patient:updated', (data) => { ... });
socket.on('patient:admitted', (data) => { ... });
socket.on('patient:discharged', (data) => { ... });

// Equipment tracking
socket.on('equipment:moved', (data) => { ... });
socket.on('equipment:status-changed', (data) => { ... });

// Alerts
socket.on('alert:triggered', (data) => { ... });
socket.on('alert:acknowledged', (data) => { ... });
socket.on('alert:resolved', (data) => { ... });

// Real-time notifications
socket.on('notification:received', (data) => { ... });
```

---

## 📊 Alert System

The system automatically triggers alerts in 25+ scenarios:

### Vital Signs Alerts
- **High Fever** (>39°C) - MEDIUM/CRITICAL
- **Hypothermia** (<35°C) - MEDIUM/CRITICAL
- **Tachycardia** (>120 bpm) - MEDIUM/HIGH
- **Bradycardia** (<60 bpm) - MEDIUM/HIGH
- **Low Oxygen** (<90%) - HIGH/CRITICAL

### Equipment Alerts
- **Missing Equipment** (no scan for 24h)
- **Maintenance Due** (30-day intervals)
- **Malfunction Detected**
- **Unauthorized Zone**

### Patient Alerts
- **Unauthorized Zone Access**
- **Admission/Discharge**
- **Prescription Expiration**

For detailed alert scenarios, see [ALERT_SCENARIOS.md](./ALERT_SCENARIOS.md)

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Role-Based Access Control** - Fine-grained permissions
- ✅ **Two-Factor Authentication** - TOTP-based 2FA
- ✅ **Password Security** - bcrypt hashing with salt rounds
- ✅ **Audit Logging** - Complete activity trail
- ✅ **Request Validation** - Input sanitization with pipes
- ✅ **HTTPS Ready** - Support for secure connections
- ✅ **CORS Configuration** - Configurable cross-origin access

---

## 📈 Performance & Scalability

- **Pagination** - All list endpoints support skip/take
- **Database Indexing** - Strategic indexes on frequently queried fields
- **Query Optimization** - TypeORM QueryBuilder for efficient queries
- **Connection Pooling** - Database connection management
- **Caching** - Ready for Redis integration
- **Horizontal Scaling** - Stateless service design
- **Load Balancing** - Compatible with Nginx, HAProxy

---

## 🐛 Debugging

### Development Logging

```bash
# Set log level
export LOG_LEVEL=debug

# Watch logs
npm run start:dev 2>&1 | grep "ERROR\|WARN"
```

### Database Debugging

```bash
# Show SQL queries
export TYPEORM_LOGGING=true

# Log query time
export TYPEORM_QUERY_LOGGING=true
```

### Monitoring Endpoints

```http
GET /health               # Health check
GET /status              # System status
GET /metrics             # Performance metrics
```

---

## 🔄 Deployment

### Docker Deployment

```bash
# Build image
docker build -t sanitio:latest .

# Run container
docker run -p 3000:3000 \
  -e DB_HOST=db \
  -e JWT_SECRET=your_secret \
  sanitio:latest
```

### Docker Compose

```bash
docker-compose up -d
```

### Cloud Deployment (AWS, GCP, Azure)

1. Build and push to container registry
2. Deploy using platform-specific tools
3. Configure environment variables
4. Run database migrations
5. Enable monitoring and logging

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/TLS certificates
- [ ] Set strong JWT secret
- [ ] Enable database backups
- [ ] Configure email service
- [ ] Set up monitoring/alerting
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Implement request logging
- [ ] Set up error tracking (Sentry)

---

## 📦 Dependencies

### Core
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common decorators
- `@nestjs/typeorm` - Database ORM
- `typeorm` - ORM library
- `@nestjs/jwt` - JWT support
- `@nestjs/passport` - Auth strategies

### Database
- `pg` - PostgreSQL client
- `@supabase/supabase-js` - Supabase client

### Message Queue
- `@nestjs/microservices` - Messaging support
- `kafkajs` - Kafka client

### Utilities
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation
- `bcrypt` - Password hashing
- `uuid` - UUID generation

---

## 🤝 Contributing

### Development Guidelines

1. **Code Style** - Follow ESLint/Prettier configuration
2. **Testing** - Write unit tests for new features
3. **Commits** - Use conventional commit messages
4. **Branches** - Create feature/bugfix branches from `develop`
5. **PR Process** - Create pull request with detailed description

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Creating a Feature

```bash
git checkout -b feature/new-feature
# Make changes
npm run test
npm run lint
git commit -m "feat(module): description"
git push origin feature/new-feature
# Create PR
```

---

## 📄 License

Copyright © 2024 SANITIO. All rights reserved.

This software is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## 📞 Support & Contact

### Documentation
- [API Documentation](./docs/API.md)
- [Alert Scenarios](./ALERT_SCENARIOS.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE.md)

### Contact
- **Email**: support@sanitio.health
- **Issues**: [GitHub Issues](https://github.com/your-org/sanito-backend/issues)
- **Documentation**: [Wiki](https://wiki.sanitio.health)

---

## 🎯 Roadmap

- [ ] GraphQL API support
- [ ] Kafka event sourcing
- [ ] Machine learning for anomaly detection
- [ ] Mobile app integration
- [ ] Advanced reporting dashboard
- [ ] Integration with EHR systems
- [ ] Telemedicine capabilities
- [ ] IoT device integration

---

**Last Updated**: January 15, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✓
