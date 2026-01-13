# 🏥 SANITIO Backend - Setup Guide

Backend complet pour la plateforme hospitalière SANITIO avec NestJS, TypeORM et Supabase.

## 🚀 Quick Start

### 1. **Configuration Supabase** ✅

Les credentials sont configurés dans `.env`:

```env
SUPABASE_URL=https://sprmvhaufsaqtbwgkdbl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=sb_secret_YwLE5SqokBN8eo22p_s0IQ_UXvabZty
DATABASE_URL=postgresql://postgres:PASSWORD@db.sprmvhaufsaqtbwgkdbl.supabase.co:5432/postgres
```

⚠️ **IMPORTANT**: Mets à jour `DATABASE_URL` avec le password PostgreSQL depuis Supabase dashboard.

### 2. **Installer les dépendances**

```bash
npm install --legacy-peer-deps
```

### 3. **Démarrer le serveur**

```bash
# Mode développement avec hot-reload
npm run start:dev

# Mode production
npm run build
npm run start:prod

# Compiler uniquement
npm run build
```

### 4. **Tester la connexion**

L'application démarre sur **http://localhost:3000**

```bash
# Test health
curl http://localhost:3000/health

# Test auth
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#","firstName":"John","lastName":"Doe"}'
```

---

## 📚 Architecture

### Modules (19 total)
- **auth** - JWT + Passport + bcrypt
- **users** - User management
- **patients** - Patient tracking with RFID
- **vital-signs** - Time-series monitoring
- **equipment** - Asset management
- **locations** - Zone tracking
- **rfid** - IoT scanner integration (@Public endpoint)
- **alerts** - Alert workflow + rules
- **notifications** - Email/SMS/Push delivery
- **activity-log** - Audit trail (RGPD compliant)
- **schedules** - Staff scheduling
- **reports** - Analytics & dashboards
- **equipment-maintenance** - Maintenance tracking
- **events** - WebSocket real-time
- **prescriptions** - Medication orders
- **medical-records** - Document storage
- **kafka** - Event streaming (optional)
- **supabase** - Supabase client integration

### Entities (16 total)
```
User → Patient → VitalSign, MedicalRecord, Prescription
User → Schedule, ActivityLog, EquipmentMaintenance
Location → Patient, Equipment, PatientPositionHistory
Equipment → EquipmentPositionHistory, EquipmentMaintenance
Alert → Notification (multi-channel)
```

### Database Schema
- **PostgreSQL** on Supabase (ssl enabled)
- **TypeORM** with automatic entity discovery
- **Indexes** on high-query fields (email, rfidId, (patientId, scannedAt))
- **Enums** for type safety (Role, AlertStatus, EquipmentStatus, etc.)

---

## 🔐 Authentication

### Endpoints

#### Public (No Auth Required)
```
POST   /auth/register               Register new user
POST   /auth/login                  Login (returns JWT token)
POST   /rfid/scan                   IoT scanner endpoint
```

#### Protected (JWT Required)
```
GET    /auth/profile                Get current user
GET    /users                       List users (roles)
GET    /patients                    List patients
POST   /patients                    Create patient
...
```

### JWT Token Format
```
Header: Authorization: Bearer <token>

Token Claims:
{
  "sub": "user-uuid",
  "email": "user@hospital.com",
  "role": "DOCTOR",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Roles
- `ADMIN` - Full system access
- `DOCTOR` - Patient care & records
- `NURSE` - Patient monitoring
- `CHIEF` - Department supervision
- `TECHNICIAN` - Equipment maintenance
- `STAFF` - General staff

---

## 🔌 API Endpoints

### Auth
```
POST   /auth/register
POST   /auth/login
GET    /auth/profile
```

### Patients
```
GET    /patients                    List all
POST   /patients                    Create new
GET    /patients/:id                Get one
PUT    /patients/:id                Update
DELETE /patients/:id                Delete
GET    /patients/:id/vital-signs    Get vitals
GET    /patients/:id/records        Get medical records
```

### Vital Signs
```
GET    /vital-signs
POST   /vital-signs                 Record new vital
GET    /vital-signs/patient/:patientId    Get patient vitals
GET    /vital-signs/:id
```

### Equipment
```
GET    /equipment
POST   /equipment
GET    /equipment/:id
PUT    /equipment/:id
DELETE /equipment/:id
```

### Alerts
```
GET    /alerts
POST   /alerts
GET    /alerts/:id
PATCH  /alerts/:id/acknowledge      Mark as seen
PATCH  /alerts/:id/resolve          Resolve with notes
GET    /alerts/stats                Alert statistics
```

### Reports
```
GET    /reports/dashboard           System overview
GET    /reports/occupation          Room occupation
GET    /reports/alerts/stats        Alert analytics
```

### WebSocket
```
Connect: ws://localhost:3000
Subscribe:
  - patient:moved            Patient changed zone
  - equipment:moved          Equipment relocated
  - alert:triggered          New alert
```

---

## 📝 Environment Variables

### Critical
```env
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your_32_char_secret_key
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=sb_secret_...
```

### Optional Features
```env
KAFKA_ENABLED=false
REDIS_ENABLED=false
SMTP_ENABLED=true
FIREBASE_ENABLED=false
```

See `.env.example` for all options.

---

## 🗄️ Database Operations

### Create Tables (via TypeORM)
```bash
npm run typeorm migration:generate -- src/database/migrations/init
npm run typeorm migration:run
```

### View Schema
```bash
# Connect to Supabase
psql postgresql://postgres:PASSWORD@db.sprmvhaufsaqtbwgkdbl.supabase.co:5432/postgres

# List tables
\dt

# View schema
\d users
```

### Seed Data
```bash
npm run seed
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:watch
```

### E2E Tests
```bash
npm run test:e2e
```

### API Testing
```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Get profile (with token)
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Create patient
curl -X POST http://localhost:3000/patients \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith","dateOfBirth":"1990-01-15"}'
```

---

## 🐛 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Verify `DATABASE_URL` in `.env` and Supabase credentials

### JWT Token Invalid
```
Error: Invalid token
```
**Solution**: Ensure `JWT_SECRET` is set correctly and tokens include Bearer prefix

### WebSocket Not Connecting
```
Error: Cannot connect to WebSocket
```
**Solution**: Verify socket.io is running and CORS is configured

---

## 📦 Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL 15+ (Supabase)
- **ORM**: TypeORM 0.3
- **Authentication**: JWT + Passport.js + bcrypt
- **Validation**: class-validator + Joi
- **WebSocket**: Socket.io + @nestjs/websockets
- **Real-time**: Supabase Realtime
- **Logging**: Winston
- **Cloud**: Supabase (PostgreSQL, Auth, Storage)

---

## 🚀 Deployment

### Docker
```bash
docker build -t sanitio-backend .
docker run -p 3000:3000 sanitio-backend
```

### Heroku
```bash
heroku create sanitio-backend
git push heroku main
```

### Railway / Render
- Connect Git repository
- Set environment variables
- Deploy

---

## 📞 Support

For issues or questions, refer to:
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Supabase Docs](https://supabase.com/docs)

---

**Created**: January 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
