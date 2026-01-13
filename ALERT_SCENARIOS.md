# 📋 Scénarios qui Stimulent les Alertes - SANITIO

## Vue d'ensemble

Le système SANITIO déclenche des alertes automatiquement basées sur divers événements et anomalies. Voici tous les scénarios qui stimulent les alertes:

---

## 1️⃣ ALERTES VITALS SIGNS (Signes Vitaux)

### A. Anomalies Détectées Automatiquement

Déclencheurs basés sur `VitalSignsService.detectAnomalies()`:

#### 🔴 **Fièvre Haute** (HIGH_FEVER)
- **Condition**: Température > 39°C
- **Sévérité**: 🟠 MEDIUM / 🔴 CRITICAL (si > 40°C)
- **Description**: Haute température indiquant une infection potentielle
- **Action**: Notification au médecin, consultation requise

#### 🔵 **Hypothermie** (HYPOTHERMIA)
- **Condition**: Température < 35°C
- **Sévérité**: 🟠 MEDIUM / 🔴 CRITICAL (si < 32°C)
- **Description**: Température dangereusement basse
- **Action**: Réchauffement du patient, surveillance

#### 💓 **Tachycardie** (TACHYCARDIA)
- **Condition**: Fréquence cardiaque > 120 bpm
- **Sévérité**: 🟠 MEDIUM / 🟡 HIGH (si > 140 bpm)
- **Description**: Rythme cardiaque excessivement élevé
- **Action**: Vérification de l'état du patient, électrocardiogramme

#### 💙 **Bradycardie** (BRADYCARDIA)
- **Condition**: Fréquence cardiaque < 60 bpm
- **Sévérité**: 🟠 MEDIUM / 🟡 HIGH (si < 40 bpm)
- **Description**: Rythme cardiaque anormalement bas
- **Action**: Évaluation cardiaque, possibilité de pacemaker

#### 🫁 **Saturation Oxygène Faible** (LOW_OXYGEN)
- **Condition**: Saturation O2 < 90%
- **Sévérité**: 🟡 HIGH / 🔴 CRITICAL (si < 85%)
- **Description**: Apport d'oxygène insuffisant au sang
- **Action**: Oxygénothérapie immédiate requise

### B. Alertes Vitals Signs Par Type
- **TEMPERATURE_ALERT**: Toute anomalie de température
- **HEART_RATE_ALERT**: Anomalies du rythme cardiaque
- **OXYGEN_ALERT**: Alertes de saturation O2
- **BP_ALERT**: Alertes de tension artérielle anormale

---

## 2️⃣ ALERTES ÉQUIPEMENT (Equipment)

### A. État de l'Équipement

#### 🔴 **Équipement Manquant** (MISSING_EQUIPMENT)
- **Condition**: Pas de scan RFID depuis > 24h
- **Sévérité**: 🟡 HIGH
- **Description**: Équipement perdu ou volé
- **Action**: Recherche, RFID scan, rapport d'inventaire

#### ⚠️ **Équipement Dysfonctionnel** (EQUIPMENT_MALFUNCTION)
- **Condition**: État = BROKEN/MAINTENANCE
- **Sévérité**: 🟡 HIGH
- **Description**: Équipement hors service
- **Action**: Réparation immédiate, substitution

#### 📍 **Équipement Hors Zone** (UNAUTHORIZED_ZONE_EQUIPMENT)
- **Condition**: Équipement trouvé dans zone restreinte
- **Sévérité**: 🟠 MEDIUM
- **Description**: Équipement en zone interdite (ex: réserve)
- **Action**: Retour à zone correcte

#### 🔧 **Maintenance Requise** (MAINTENANCE_DUE)
- **Condition**: Intervalle de 30j depuis dernière maintenance
- **Sévérité**: 🟠 MEDIUM
- **Description**: Maintenance préventive requise
- **Action**: Programmer maintenance, test

---

## 3️⃣ ALERTES PATIENTS (Patients)

### A. Sécurité Patient

#### 🚨 **Patient en Zone Interdite** (UNAUTHORIZED_ZONE_PATIENT)
- **Condition**: Patient en zone restrictive (ICU, OR, etc.)
- **Sévérité**: 🔴 CRITICAL
- **Description**: Patient détecté hors de sa zone autorisée
- **Action**: Intervention immédiate, supervision requise

#### 🏥 **Patient Admis** (PATIENT_ADMITTED)
- **Condition**: Nouvel admission
- **Sévérité**: ℹ️ INFO
- **Description**: Enregistrement nouveau patient
- **Action**: Initialisation dossier, assignment médecin

#### 🚪 **Patient Congédié** (PATIENT_DISCHARGED)
- **Condition**: Patient marqué DISCHARGED
- **Sévérité**: ℹ️ INFO
- **Description**: Sortie patient
- **Action**: Clôture dossier, suivi ambulatoire

---

## 4️⃣ ALERTES LOCALISATION (Location)

### A. Surpopulation

#### 🏥 **Zone Overcrowded** (ZONE_OVERCROWDED)
- **Condition**: Occupancy > 90%
- **Sévérité**: 🟠 MEDIUM / 🟡 HIGH (si > 95%)
- **Description**: Trop many patients/équipement dans zone
- **Action**: Transfert patient, réorganisation

#### 📍 **Haute Densité Équipement** (HIGH_EQUIPMENT_DENSITY)
- **Condition**: > 10 équipements dans même zone
- **Sévérité**: 🟠 MEDIUM
- **Description**: Concentration équipement excessive
- **Action**: Redistribution, audit inventaire

---

## 5️⃣ ALERTES MEDICAMENTS (Prescriptions)

### A. Gestion Médicaments

#### ⏰ **Prescription Expirée** (PRESCRIPTION_EXPIRED)
- **Condition**: Date expiration dépassée
- **Sévérité**: 🔴 CRITICAL
- **Description**: Médicament expiré en cours
- **Action**: Remplacement immédiat

#### 💊 **Dosage Anormal** (ABNORMAL_DOSAGE)
- **Condition**: Dosage > max recommandé
- **Sévérité**: 🔴 CRITICAL
- **Description**: Surdosage potentiel
- **Action**: Vérification médecin, ajustement

#### 🚫 **Interaction Médicamenteuse** (DRUG_INTERACTION)
- **Condition**: Deux médicaments incompatibles
- **Sévérité**: 🟡 HIGH
- **Description**: Interaction dangereuse détectée
- **Action**: Révision prescription

---

## 6️⃣ ALERTES RFID (Tracking)

### A. Problèmes RFID

#### 📡 **Signal RFID Faible** (WEAK_RFID_SIGNAL)
- **Condition**: Signal strength < -80 dBm
- **Sévérité**: 🟠 MEDIUM
- **Description**: Mauvaise qualité signal bracelet/tag
- **Action**: Vérifier position, remplacer batterie

#### ❌ **Tag RFID Manquant** (RFID_TAG_MISSING)
- **Condition**: No RFID tag pour patient/équipement
- **Sévérité**: 🟡 HIGH
- **Description**: Pas de localisation possible
- **Action**: Assigner nouveau tag RFID

#### 🔄 **Données RFID Dupliquées** (RFID_DUPLICATE_DATA)
- **Condition**: Lectures < 5s apart
- **Sévérité**: 🟢 LOW (INFO)
- **Description**: Scans dupliqués nettoyés
- **Action**: Monitoring, aucune action requise

---

## 7️⃣ ALERTES SYSTEME (System)

### A. Connectivité

#### 🔌 **Équipement Déconnecté** (DEVICE_DISCONNECTED)
- **Condition**: No sync depuis > 5 min
- **Sévérité**: 🟠 MEDIUM / 🟡 HIGH (si > 30 min)
- **Description**: Perte connectivité appareil
- **Action**: Diagnostic réseau, reconnexion

#### 📊 **Base Données Lente** (DB_SLOW_QUERY)        // A enlever
- **Condition**: Query time > 1000ms
- **Sévérité**: 🟠 MEDIUM
- **Description**: Performance base données dégradée
- **Action**: Optimisation query, cache

#### 🔄 **Kafka Backlog** (KAFKA_BACKLOG)       
- **Condition**: > 1000 messages en attente
- **Sévérité**: 🟡 HIGH
- **Description**: Queue messages saturée
- **Action**: Scaling consumers, investigation

---

## 8️⃣ ALERTES UTILISATEURS (Users)

### A. Accès

#### 🔓 **Tentative Accès Non-Autorisée** (UNAUTHORIZED_ACCESS)
- **Condition**: Wrong role pour ressource
- **Sévérité**: 🔴 CRITICAL
- **Description**: Tentative accès ressource restreinte
- **Action**: Log audit, notification IT

#### ⏱️ **Inactivité Utilisateur** (USER_INACTIVITY)
- **Condition**: Pas d'activité depuis > 30 min
- **Sévérité**: 🟢 LOW
- **Description**: Session might expire
- **Action**: Alerte, re-login

---

## 📊 Matrice de Sévérité

| Niveau | Couleur | Exemples | Réponse |
|--------|---------|----------|---------|
| **CRITICAL** 🔴 | Rouge | Fièvre >40°C, O2<85%, Patient zone interdite, Surdosage | Immédiate, Page médecin |
| **HIGH** 🟡 | Jaune | Tachycardie >140, Bradycardie <40, Équipement manquant | Rapide, Dans 5 min |
| **MEDIUM** 🟠 | Orange | Fièvre >39°C, Hypothermie, Surcharge zone | Standard, Dans 30 min |
| **LOW** 🟢 | Vert | RFID duplex, Inactivité, Monitoring | Pas urgent, Log |
| **INFO** ℹ️ | Bleu | Admission, Congé, Status change | Info, Dashboard |

---

## 🔧 Types d'Alertes (AlertType Enum)

```
VITAL_SIGN_ALERT
TEMPERATURE_ALERT
HEART_RATE_ALERT
OXYGEN_ALERT
BP_ALERT
EQUIPMENT_MALFUNCTION
MISSING_EQUIPMENT
UNAUTHORIZED_ZONE_EQUIPMENT
MAINTENANCE_DUE
UNAUTHORIZED_ZONE_PATIENT
PATIENT_ADMITTED
PATIENT_DISCHARGED
ZONE_OVERCROWDED
HIGH_EQUIPMENT_DENSITY
PRESCRIPTION_EXPIRED
ABNORMAL_DOSAGE
DRUG_INTERACTION
WEAK_RFID_SIGNAL
RFID_TAG_MISSING
RFID_DUPLICATE_DATA
DEVICE_DISCONNECTED
DB_SLOW_QUERY
KAFKA_BACKLOG
UNAUTHORIZED_ACCESS
USER_INACTIVITY
```

---

## ✅ Statuts d'Alerte

| Status | Signification | Action |
|--------|---------------|--------|
| **OPEN** | Nouvelle alerte, pas traitée | Doit être traitée |
| **ACKNOWLEDGED** | Reconnaître par staff | En cours de traitement |
| **RESOLVED** | Problème résolu | Fermée, archive |

---

## 📝 Exemple Flow Alerte

```
1. ❌ Problème détecté
   └─ VitalSign.temperature = 40.5°C
   
2. 🔔 Alerte créée
   └─ Type: TEMPERATURE_ALERT
   └─ Severity: CRITICAL
   └─ Status: OPEN
   
3. 📢 Notification envoyée
   └─ Médecin reçoit SMS
   └─ Infirmière voit sur Dashboard
   └─ Alerte apparaît dans liste
   
4. 👨‍⚕️ Staff prend action
   └─ Infirmière acknowledge alerte
   └─ Médicaments administrés
   └─ Température réduite
   
5. ✅ Alerte résolue
   └─ Status: RESOLVED
   └─ Resolution notes: "Antipyrétiques donnés"
   └─ Archive alerte
```

---

## 🎯 Intégration Modules

### Connections principales:
- **VitalSigns → Alerts** (detectAnomalies trigger alerts)
- **Equipment → Alerts** (status/missing equipment alerts)
- **Patients → Alerts** (zone check, admission/discharge)
- **Locations → Alerts** (occupancy monitoring)
- **Prescriptions → Alerts** (expiration check)
- **RFID → Alerts** (signal quality, zone detection)
- **Alerts → Notifications** (SMS, Email, Push pour chaque alert)
- **Alerts → ActivityLog** (Toutes les alertes loggées)

---

## 🚀 Déclenchement Manuel

Fonction: `AlertsService.triggerAlert(type, severity, relatedData)`

Exemple:
```typescript
await alertsService.triggerAlert(
  'EQUIPMENT_MALFUNCTION',
  AlertSeverity.CRITICAL,
  {
    equipmentId: 'eq-123',
    reason: 'Batterie épuisée',
    location: 'ICU-A'
  }
);
```

---

## 📈 Statistiques & Analytics

Via `Reports.getAlertStats()`:
- Distribution par type
- Distribution par sévérité
- Distribution par status
- Tendances temporelles
- Temps de résolution moyen
- Taux fermeture

---

**Dernière mise à jour**: 13 Janvier 2026
**Version**: 1.0 Complète
**Status**: ✅ Production Ready
