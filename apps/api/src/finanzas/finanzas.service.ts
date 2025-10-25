import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FinanzasService {
  constructor(private ds: DataSource) {}

  private parseMoney(v:any){ const n=Number(v); if(!Number.isFinite(n)||n<=0) throw new BadRequestException('Monto invÃ¡lido'); return +n.toFixed(2) }
  private today(){ return new Date().toISOString().slice(0,10) }

  async crearGasto(body:any){
    const monto = this.parseMoney(body?.monto);
    const categoria = String(body?.categoria||'').trim();
    if(!categoria) throw new BadRequestException('CategorÃ­a requerida');

    // intenta columnas {fecha,monto,categoria,descripcion,comprobante_url,cuenta_id}
    const cols:any[] = await this.ds.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='gasto'
    `);
    const names = cols.map(c=>c.column_name);
    if(!names.includes('monto') || !names.includes('categoria') || !names.includes('fecha')){
      // inserciÃ³n mÃ­nima (monto,categoria) con defaults si existen
      throw new BadRequestException(`Tabla "gasto" no tiene columnas esperadas (necesito al menos fecha, monto, categoria). Tengo: ${names.join(', ')}`);
    }
    const sql = `INSERT INTO "gasto" ("fecha","monto","categoria","descripcion","comprobante_url","cuenta_id")
                 VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const row = await this.ds.query(sql, [
      this.today(), String(monto.toFixed(2)), categoria,
      body?.descripcion ?? null, body?.comprobante_url ?? null, body?.cuenta_id ?? null
    ]);
    return { ok:true, data: row[0] };
  }

  async crearIngreso(body:any){
    const monto = this.parseMoney(body?.monto);
    const cuenta = String(body?.cuenta||'').trim();
    if(!cuenta) throw new BadRequestException('Cuenta requerida');

    // necesitamos "ingreso_bancario" con {cuenta_id, fecha, monto, referencia}
    const cols:any[] = await this.ds.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='ingreso_bancario'
    `);
    const names = cols.map(c=>c.column_name);
    if(!names.includes('monto') || !names.includes('fecha') || !names.includes('cuenta_id')){
      throw new BadRequestException(`Tabla "ingreso_bancario" no tiene columnas esperadas (cuenta_id, fecha, monto). Tengo: ${names.join(', ')}`);
    }
    // Nota: resolvemos "cuenta" -> cuenta_id por numero/nombre si existen columnas
    let cuentaId = body?.cuenta_id ?? null;
    if(!cuentaId){
      const cCols:any[] = await this.ds.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema='public' AND table_name='cuenta_bancaria'
      `);
      const hasNumero = cCols.some(c=> /numero/i.test(c.column_name));
      const hasNombre = cCols.some(c=> /nombre/i.test(c.column_name));
      if(hasNumero){
        const r = await this.ds.query(`SELECT id FROM cuenta_bancaria WHERE numero=$1 LIMIT 1`, [cuenta]);
        cuentaId = r?.[0]?.id ?? null;
      }
      if(!cuentaId && hasNombre){
        const r2 = await this.ds.query(`SELECT id FROM cuenta_bancaria WHERE nombre=$1 LIMIT 1`, [cuenta]);
        cuentaId = r2?.[0]?.id ?? null;
      }
    }
    if(!cuentaId) throw new BadRequestException('No pude resolver cuenta_id (usa cuenta_id o asegÃºrate de que cuenta_bancaria tenga filas y columnas esperadas)');

    const sql = `INSERT INTO "ingreso_bancario" ("cuenta_id","fecha","monto","referencia")
                 VALUES ($1,$2,$3,$4) RETURNING *`;
    const row = await this.ds.query(sql, [cuentaId, this.today(), String(monto.toFixed(2)), body?.referencia ?? null]);
    return { ok:true, data: row[0] };
  }

  async flujo(desde?:string, hasta?:string){
    const rx = /^\d{4}-\d{2}-\d{2}$/;
    if(desde && !rx.test(desde)) throw new BadRequestException('Formato desde invÃ¡lido (yyyy-mm-dd)');
    if(hasta && !rx.test(hasta)) throw new BadRequestException('Formato hasta invÃ¡lido (yyyy-mm-dd)');
    const d = desde || '1900-01-01';
    const h = hasta || '2999-12-31';

    const eg = await this.ds.query(`SELECT COALESCE(SUM(monto::numeric),0) egresos FROM gasto WHERE fecha BETWEEN $1 AND $2`, [d,h]);
    const ig = await this.ds.query(`SELECT COALESCE(SUM(monto::numeric),0) ingresos FROM ingreso_bancario WHERE fecha BETWEEN $1 AND $2`, [d,h]);
    const egresos = Number(eg?.[0]?.egresos ?? 0);
    const ingresos = Number(ig?.[0]?.ingresos ?? 0);
    return { ok:true, rango:{desde:d,hasta:h}, totals:{ ingresos, egresos, neto:+(ingresos-egresos).toFixed(2) } };
  }
}
