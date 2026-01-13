import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { getTypeOrmConfig } from './database/config/typeorm.config';
import { envValidationSchema } from './config/env.validation';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { VitalSignsModule } from './modules/vital-signs/vital-signs.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { LocationsModule } from './modules/locations/locations.module';
import { RfidModule } from './modules/rfid/rfid.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { ReportsModule } from './modules/reports/reports.module';
import { EquipmentMaintenanceModule } from './modules/equipment-maintenance/equipment-maintenance.module';
import { EventsModule } from './modules/events/events.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { PatientPositionHistoryModule } from './modules/patient-position-history/patient-position-history.module';
import { EquipmentPositionHistoryModule } from './modules/equipment-position-history/equipment-position-history.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
    }),
    AuthModule,
    UsersModule,
    PatientsModule,
    VitalSignsModule,
    EquipmentModule,
    LocationsModule,
    RfidModule,
    AlertsModule,
    NotificationsModule,
    ActivityLogModule,
    SchedulesModule,
    ReportsModule,
    EquipmentMaintenanceModule,
    EventsModule,
    PrescriptionsModule,
    MedicalRecordsModule,
    KafkaModule,
    PatientPositionHistoryModule,
    EquipmentPositionHistoryModule,
    SupabaseModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
