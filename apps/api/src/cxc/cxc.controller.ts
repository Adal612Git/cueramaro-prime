import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CxcService } from './cxc.service';

@Controller('cxc')
export class CxcController {
  constructor(private readonly svc: CxcService) {}

  @Get()
  root(){ return { message: 'âœ… CxC endpoint activo' }; }

  @Get('diagnostic')
  diagnostic(){ return this.svc.diagnostic(); }

  @Post(':id/abonos')
  abonar(@Param('id') id: string, @Body() body: any){
    return this.svc.abonar(id, body?.monto, body?.referencia ?? null);
  }
}
