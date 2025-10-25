import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
function ctxWith(role: string) {
  return { switchToHttp: () => ({ getRequest: () => ({ user: { role } }) }), getHandler: () => ({}), getClass: () => ({}) } as any;
}
describe('RolesGuard', () => {
  it('permite si rol requerido coincide', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']) } as any as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(ctxWith('ADMIN'))).toBe(true);
  });
  it('bloquea si rol requerido no coincide', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']) } as any as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(ctxWith('CAJA'))).toBe(false);
  });
  it('sin metadatos de rol, permite', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) } as any as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(ctxWith('ALMACEN'))).toBe(true);
  });
});
