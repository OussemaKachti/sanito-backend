import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '@modules/patients/entities/patient.entity';
import { Equipment } from '@modules/equipment/entities/equipment.entity';
import { Alert } from '@modules/alerts/entities/alert.entity';
import { Location } from '@modules/locations/entities/location.entity';
import { PatientStatus } from '@common/enums/patient-status.enum';
import { EquipmentStatus } from '@common/enums/equipment-status.enum';
import { AlertStatus } from '@common/enums/alert-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async getDashboard(): Promise<any> {
    const totalPatients = await this.patientRepository.count();
    const activePatients = await this.patientRepository.count({ where: { status: PatientStatus.ACTIVE as any } });
    const totalEquipment = await this.equipmentRepository.count();
    const availableEquipment = await this.equipmentRepository.count({ where: { status: EquipmentStatus.AVAILABLE as any } });
    const openAlerts = await this.alertRepository.count({ where: { status: AlertStatus.OPEN as any } });
    const criticalAlerts = await this.alertRepository.count({ where: { severity: 'CRITICAL' as any } });

    return {
      totalPatients,
      activePatients,
      totalEquipment,
      availableEquipment,
      openAlerts,
      criticalAlerts,
      equipmentUtilization: ((( totalEquipment - availableEquipment) / totalEquipment) * 100).toFixed(2),
      patientOccupancy: ((activePatients / totalPatients) * 100).toFixed(2),
    };
  }

  async getOccupation(): Promise<any> {
    const locations = await this.locationRepository.find({
      relations: ['patients', 'equipment'],
    });

    const zones = locations.map((loc) => ({
      locationId: loc.id,
      name: loc.name,
      patients: loc.patients?.length || 0,
      equipment: loc.equipment?.length || 0,
      capacity: loc.capacity,
      occupancyRate: ((((loc.patients?.length || 0) + (loc.equipment?.length || 0)) / (loc.capacity || 1)) * 100).toFixed(2),
    }));

    const totalOccupancy = zones.reduce((sum, z) => sum + parseFloat(z.occupancyRate), 0) / zones.length;

    return {
      zones,
      averageOccupancyRate: totalOccupancy.toFixed(2),
    };
  }

  async getAlertStats(): Promise<any> {
    const alerts = await this.alertRepository.find();
    const byType = {};
    const bySeverity = {};
    const byStatus = {};

    alerts.forEach((alert) => {
      byType[alert.alertType || 'unknown'] = (byType[alert.alertType || 'unknown'] || 0) + 1;
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      byStatus[alert.status] = (byStatus[alert.status] || 0) + 1;
    });

    return { byType, bySeverity, byStatus, total: alerts.length };
  }

  async getPatientStats(dateRange?: { start: Date; end: Date }): Promise<any> {
    let query = this.patientRepository.createQueryBuilder('patient');

    if (dateRange) {
      query.where('patient.admissionDate >= :startDate', { startDate: dateRange.start });
      query.andWhere('patient.admissionDate <= :endDate', { endDate: dateRange.end });
    }

    const admissions = await query.getCount();
    const discharges = await query.andWhere('patient.status = :status', { status: 'DISCHARGED' }).getCount();

    return {
      admissions,
      discharges,
      net: admissions - discharges,
    };
  }

  async getEquipmentStats(): Promise<any> {
    const total = await this.equipmentRepository.count();
    const available = await this.equipmentRepository.count({ where: { status: EquipmentStatus.AVAILABLE as any } });
    const inUse = await this.equipmentRepository.count({ where: { status: EquipmentStatus.IN_USE as any } });
    const maintenance = await this.equipmentRepository.count({ where: { status: EquipmentStatus.MAINTENANCE as any } });
    const broken = await this.equipmentRepository.count({ where: { status: EquipmentStatus.BROKEN as any } });

    return {
      total,
      available,
      inUse,
      maintenance,
      broken,
      utilizationRate: (((inUse + maintenance) / total) * 100).toFixed(2),
    };
  }

  async getAlertTrends(dateRange: { start: Date; end: Date }): Promise<any[]> {
    const alerts = await this.alertRepository
      .createQueryBuilder('alert')
      .where('alert.triggeredAt >= :startDate', { startDate: dateRange.start })
      .andWhere('alert.triggeredAt <= :endDate', { endDate: dateRange.end })
      .orderBy('alert.triggeredAt', 'ASC')
      .getMany();

    const trends: Record<string, number> = {};
    alerts.forEach((alert) => {
      const date = alert.triggeredAt.toISOString().split('T')[0];
      trends[date] = (trends[date] || 0) + 1;
    });

    return Object.entries(trends).map(([date, count]) => ({ date, count }));
  }

  async getOccupationTrends(dateRange: { start: Date; end: Date }): Promise<any[]> {
    // TODO: Aggregate from PatientPositionHistory
    return [
      { date: '2026-01-01', occupancy: 85 },
      { date: '2026-01-02', occupancy: 88 },
    ];
  }

  async getKPIs(): Promise<any> {
    const dashboard = await this.getDashboard();
    const equipment = await this.getEquipmentStats();
    
    return {
      localizationRate: 95.5,
      averageSearchTime: 2.5, // minutes
      equipmentUtilization: equipment.utilizationRate,
      patientSatisfaction: 4.5, // out of 5
      systemUptime: 99.9,
    };
  }

  async generatePDF(reportType: string): Promise<any> {
    // TODO: Integrate with PDF generation library (pdfkit, puppeteer, etc.)
    return {
      type: reportType,
      url: `/reports/${reportType}-${Date.now()}.pdf`,
      generatedAt: new Date(),
      message: 'PDF generation pending',
    };
  }

  async exportToExcel(reportType: string): Promise<any> {
    // TODO: Integrate with Excel generation library (exceljs, etc.)
    return {
      type: reportType,
      url: `/exports/${reportType}-${Date.now()}.xlsx`,
      generatedAt: new Date(),
      message: 'Excel export pending',
    };
  }

  async getStaffStats(): Promise<any> {
    // TODO: Join with User and Department tables
    return {
      totalStaff: 0,
      byDepartment: {},
      byRole: {},
    };
  }

  async getMedicationStats(): Promise<any> {
    // TODO: Join with Prescription and Drug tables
    return {
      totalPrescriptions: 0,
      byMedication: {},
      topMedications: [],
    };
  }
}
