import { Injectable } from '@nestjs/common';

@Injectable()
export class AltDashboardService {
  async getStats() {
    return {
      inventarioKg: 1245,
      ventasCount: 12,
      ventasTotal: 18450
    };
  }
}
