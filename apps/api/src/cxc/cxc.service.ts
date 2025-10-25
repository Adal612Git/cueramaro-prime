import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CuentaPorCobrar, AbonoCxc } from './entities/cxc.entities';

@Injectable()
export class CxcService {
  constructor(
    @InjectRepository(CuentaPorCobrar) private cxcRepo: Repository<CuentaPorCobrar>,
    @InjectRepository(AbonoCxc) private abonoRepo: Repository<AbonoCxc>,
    private ds: DataSource,
  ) {}

  async diagnostic() {
    const colsCxc = await this.ds.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='cuenta_por_cobrar'
      ORDER BY 1
    `);
    const colsAbono = await this.ds.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='abono_cxc'
      ORDER BY 1
    `);
    return {
      cuenta_por_cobrar: colsCxc.map((c:any)=>c.column_name),
      abono_cxc: colsAbono.map((c:any)=>c.column_name),
    };
  }

  private parseMoney(v: any): number {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    const n = Number(v);
    if (!Number.isFinite(n)) throw new BadRequestException('Monto invÃ¡lido');
    return n;
  }

  async abonar(cxcId: string, montoIn: any, ref?: string) {
    const monto = this.parseMoney(montoIn);
    if (monto <= 0) throw new BadRequestException('Monto debe ser > 0');

    // try ORM path first
    try {
      const cxc = await this.cxcRepo.findOne({ where: { id: cxcId } });
      if (!cxc) throw new NotFoundException('CxC no encontrada');

      const saldoNum = this.parseMoney(cxc.saldo);
      if (saldoNum <= 0) throw new ConflictException('CxC ya pagada');

      const nuevoSaldo = +(saldoNum - monto).toFixed(2);
      const nuevoEstado =
        nuevoSaldo <= 0 ? 'PAGADA' :
        (cxc.fechaVencimiento && new Date(cxc.fechaVencimiento) < new Date()) ? 'VENCIDA' :
        'PARCIAL';

      await this.ds.transaction(async (trx) => {
        await trx.getRepository(AbonoCxc).save({
          cxcId, monto: String(monto.toFixed(2)), referencia: ref ?? null,
        });
        await trx.getRepository(CuentaPorCobrar).update({ id: cxcId }, {
          saldo: String(Math.max(nuevoSaldo,0).toFixed(2)),
          estado: nuevoEstado as any,
        });
      });

      const updated = await this.cxcRepo.findOne({ where: { id: cxcId } });
      return { ok: true, cxc: updated };
    } catch (e:any) {
      // fallback: raw SQL dynamic (descubre columnas saldo/estado)
      const cols:any[] = await this.ds.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema='public' AND table_name='cuenta_por_cobrar'
      `);
      const names = cols.map(c=>c.column_name);
      const saldoCol = names.find(n=> /saldo/i.test(n));
      const estadoCol = names.find(n=> /estado/i.test(n));
      const idCol = names.find(n=> /^id$/i.test(n)) ?? 'id';

      if (!saldoCol || !estadoCol) {
        throw new ConflictException(`Esquema inesperado en cuenta_por_cobrar. Necesito columnas tipo 'saldo' y 'estado'. Tengo: ${names.join(', ')}`);
      }

      const cxcRows = await this.ds.query(`SELECT "${idCol}" AS id, "${saldoCol}" AS saldo FROM "cuenta_por_cobrar" WHERE "${idCol}" = $1`, [cxcId]);
      if (!cxcRows?.length) throw new NotFoundException('CxC no encontrada');

      const saldoNum = this.parseMoney(cxcRows[0].saldo);
      if (saldoNum <= 0) throw new ConflictException('CxC ya pagada');

      const nuevoSaldo = +(saldoNum - monto).toFixed(2);
      const nuevoEstado = (nuevoSaldo <= 0) ? 'PAGADA' : 'PARCIAL';

      await this.ds.transaction(async (trx)=>{
        // abono_cxc dynamic insert: detect columns
        const abCols:any[] = await trx.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema='public' AND table_name='abono_cxc'
        `);
        const abHasRef = abCols.some(c=> /referencia/i.test(c.column_name));
        const abHasCxcId = abCols.some(c=> /cxc_id/i.test(c.column_name));
        const params:any[] = [cxcId, String(monto.toFixed(2))];
        const sql = `INSERT INTO "abono_cxc" (${abHasCxcId?'"cxc_id",':''}"monto"${abHasRef?', "referencia"':''}) VALUES (${abHasCxcId?'$1, ':''}$${abHasCxcId?2:1}${abHasRef?`, $${abHasCxcId?3:2}`:''})`;
        if(abHasRef) params.push(ref ?? null);
        await trx.query(sql, params);

        await trx.query(
          `UPDATE "cuenta_por_cobrar" SET "${saldoCol}"=$1, "${estadoCol}"=$2 WHERE "${idCol}"=$3`,
          [String(Math.max(nuevoSaldo,0).toFixed(2)), nuevoEstado, cxcId]
        );
      });

      const updated = await this.ds.query(`SELECT * FROM "cuenta_por_cobrar" WHERE "${idCol}"=$1`, [cxcId]);
      return { ok: true, cxc: updated?.[0] ?? null, mode: 'fallback-sql' };
    }
  }
}
