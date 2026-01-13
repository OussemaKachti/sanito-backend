import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  notifyPatientMoved(patientId: string, locationId: string): void {
    console.log(`Patient ${patientId} moved to ${locationId}`);
  }

  notifyEquipmentMoved(equipmentId: string, locationId: string): void {
    console.log(`Equipment ${equipmentId} moved to ${locationId}`);
  }

  notifyAlertTriggered(alertId: string): void {
    console.log(`Alert ${alertId} triggered`);
  }
}
