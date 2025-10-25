import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "cueramaro-prime-api",
      version: "0.1.0",
      timestamp: new Date().toISOString()
    };
  }

  @Get("health")
  getHealthCheck() {
    return {
      status: "healthy", 
      database: "postgresql",
      cache: "redis",
      timestamp: new Date().toISOString()
    };
  }
}
