 # 🏥 SANITIO Backend - All Functions List

## 🔐 Auth Module
✅ register(email, password, firstName, lastName)
✅ login(email, password)
✅ validateUser(id)
✅ generateTokens(user)

## 👥 Users Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 🏥 Patients Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 📊 Vital Signs Module
✅ create(data)
✅ findAll(skip, take)
✅ findByPatient(patientId, skip, take)
✅ findOne(id)

## ⚙️ Equipment Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 📍 Locations Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 🏷️ RFID Module
✅ processScan(data)
✅ findAllScans(skip, take)
✅ findByRfidId(rfidId, skip, take)
✅ getCurrentLocation(rfidId)

## 🚨 Alerts Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ acknowledge(id, userId)
✅ resolve(id, userId, notes?)
✅ getStats()

## 📬 Notifications Module
✅ send(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ markAsRead(id)

## 📝 Activity Log Module
✅ findAll(skip, take)
✅ findByUser(userId, skip, take)
✅ findOne(id)
✅ getStats()

## 📅 Schedules Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 📋 Reports Module
✅ getDashboard()
✅ getOccupation()
✅ getAlertStats()

## 🔧 Equipment Maintenance Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 💊 Prescriptions Module
✅ create(data)
✅ findAll(skip, take)
✅ findOne(id)
✅ update(id, data)
✅ remove(id)

## 🗂️ Medical Records Module
✅ create(data)
✅ findAll(skip, take)
✅ findByPatient(patientId, skip, take)
✅ findOne(id)
✅ remove(id)

## 🔄 Kafka Module
✅ sendMessage(topic, message)
✅ consumeMessages(topic)

## 🌐 Events Module (WebSocket)
✅ notifyPatientMoved()
✅ notifyEquipmentMoved()
✅ notifyAlertTriggered()

## 🗄️ Supabase Module
✅ getClient()
✅ testConnection()
✅ insert(table, data)
✅ fetch(table, filters?)
✅ update(table, id, data)
✅ delete(table, id)

---

## 🔐 Auth Module - MISSING FUNCTIONS (8)
❌ refreshToken(refreshToken)
❌ logout(userId)
❌ verifyToken(token)
❌ changePassword(userId, oldPassword, newPassword)
❌ resetPassword(email)
❌ verifyResetToken(token)
❌ enableTwoFactor(userId)
❌ verifyTwoFactor(userId, code)

## 👥 Users Module - MISSING FUNCTIONS (7)
❌ findByEmail(email)
❌ findByRole(role)
❌ updatePassword(userId, newPassword)
❌ updateAvatar(userId, avatarUrl)
❌ getUserProfile(userId)
❌ deactivateUser(userId)
❌ searchUsers(query)

## 🏥 Patients Module - MISSING FUNCTIONS (10)
❌ search(query)
❌ filterByStatus(status, skip, take)
❌ filterByDateRange(startDate, endDate, skip, take)
❌ getPositionHistory(patientId, skip, take)
❌ getVitalSignsHistory(patientId, dateRange, skip, take)
❌ discharge(patientId, notes)
❌ admit(data)
❌ getStats()
❌ checkUnauthorizedZone(patientId)
❌ getPatientWithRelations(patientId)

## 📊 Vital Signs Module - MISSING FUNCTIONS (4)
❌ getLatest(patientId)
❌ getAverages(patientId, timeRange)
❌ detectAnomalies(patientId)
❌ getByDateRange(patientId, startDate, endDate, skip, take)

## ⚙️ Equipment Module - MISSING FUNCTIONS (9)
❌ findByType(type)
❌ findByLocation(locationId)
❌ findByStatus(status)
❌ updateStatus(equipmentId, newStatus)
❌ updateLocation(equipmentId, newLocationId)
❌ getPositionHistory(equipmentId, skip, take)
❌ checkMissingEquipment()
❌ getMaintenanceSchedule(equipmentId)
❌ searchEquipment(query)

## 📍 Locations Module - MISSING FUNCTIONS (5)
❌ getOccupancy(locationId)
❌ getOccupants(locationId)
❌ findByType(type)
❌ findByWard(ward)
❌ getOccupationHistory(locationId, dateRange, skip, take)

## 🏷️ RFID Module - MISSING FUNCTIONS (8)
❌ deduplicate()
❌ validateRfidData(data)
❌ parseHopelandData(rawData)
❌ assignPatientBracelet(patientId, rfidBadgeId)
❌ assignEquipmentTag(equipmentId, rfidTagId)
❌ getMovementHistory(rfidId, startDate, endDate)
❌ detectUnauthorizedZone(rfidId, locationId)
❌ getSignalStrengthTrend(rfidId)

## 🚨 Alerts Module - MISSING FUNCTIONS (8)
❌ getAlertsByType(type, skip, take)
❌ getAlertsBySeverity(severity, skip, take)
❌ getAlertsByStatus(status, skip, take)
❌ createAlertRule(data)
❌ updateAlertRule(ruleId, data)
❌ deleteAlertRule(ruleId)
❌ triggerAlert(type, severity, relatedData)
❌ getAlertsByPatient(patientId, skip, take)

## 📬 Notifications Module - MISSING FUNCTIONS (7)
❌ sendEmail(to, subject, message)
❌ sendSMS(phone, message)
❌ sendPush(userId, title, message)
❌ sendWebSocket(userId, data)
❌ queueNotification(data)
❌ retryFailedNotifications()
❌ getNotificationStats(dateRange)

## 📝 Activity Log Module - MISSING FUNCTIONS (5)
❌ logAction(userId, action, entityType, entityId, description)
❌ logDataChange(userId, entityType, entityId, oldValues, newValues)
❌ findByAction(action, skip, take)
❌ findByEntityType(entityType, skip, take)
❌ searchLogs(query)

## 📅 Schedules Module - MISSING FUNCTIONS (5)
❌ checkConflicts(userId, startTime, endTime, locationId?)
❌ getScheduleByUser(userId, dateRange)
❌ getScheduleByLocation(locationId, dateRange)
❌ getScheduleByDateRange(startDate, endDate, skip, take)
❌ getAvailability(userId, dateRange)

## 📋 Reports Module - MISSING FUNCTIONS (9)
❌ getPatientStats(dateRange)
❌ getEquipmentStats()
❌ getAlertTrends(dateRange)
❌ getOccupationTrends(dateRange)
❌ getKPIs()
❌ generatePDF(reportType)
❌ exportToExcel(reportType)
❌ getStaffStats()
❌ getMedicationStats()

## 🔧 Equipment Maintenance Module - MISSING FUNCTIONS (4)
❌ scheduleNewMaintenance(equipmentId, maintenanceType, scheduledDate)
❌ getScheduledMaintenance(skip, take)
❌ getCompletedMaintenance(skip, take)
❌ calculateNextMaintenanceDate(equipmentId)

## 💊 Prescriptions Module - MISSING FUNCTIONS (4)
❌ findByPatient(patientId, skip, take)
❌ findByStatus(status, skip, take)
❌ findActive(skip, take)
❌ updateStatus(prescriptionId, newStatus)

## 🗂️ Medical Records Module - MISSING FUNCTIONS (4)
❌ findByType(type, skip, take)
❌ findByDateRange(startDate, endDate, skip, take)
❌ uploadDocument(patientId, file, recordType)
❌ getRecordsByType(patientId, type, skip, take)

## 🔄 Kafka Module - MISSING FUNCTIONS (4)
❌ onMessageReceived(topic, callback)
❌ handleRfidScan(message)
❌ handleAlert(message)
❌ handleNotification(message)

## 🌐 Events Module / WebSocket - MISSING FUNCTIONS (5)
❌ subscribeToPatientUpdates(userId, patientId)
❌ subscribeToEquipmentUpdates(userId, equipmentId)
❌ subscribeToAlerts(userId)
❌ unsubscribe(userId, subscription)
❌ broadcastToClients(event, data)

## 🔐 Cross-Module / Shared Functions (8)
❌ validatePermissions(userId, action, resource)
❌ checkResourceOwnership(userId, resourceId)
❌ globalSearch(query, entityTypes?)
❌ advancedSearch(filters)
❌ health()
❌ status()
❌ getDatabaseStats()
❌ getSystemStats()

---

**Total: 19 Modules | 55+ Functions (Complètes) | 124+ Functions Manquantes (À Implémenter)**
