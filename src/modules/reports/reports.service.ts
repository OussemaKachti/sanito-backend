import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  async getDashboard(): Promise<any> {
    return {
      totalPatients: 0,
      activePatients: 0,
      totalEquipment: 0,
      availableEquipment: 0,
      openAlerts: 0,
      criticalAlerts: 0,
    };
  }

  async getOccupation(): Promise<any> {
    return {
      zones: [],
      occupancyRate: 0,
    };
  }

  async getAlertStats(): Promise<any> {
    return {
      byType: {},
      bySeverity: {},
      byStatus: {},
    };
  }
}
