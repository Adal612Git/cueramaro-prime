import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export type CxcEstado = 'PENDIENTE' | 'PARCIAL' | 'VENCIDA' | 'PAGADA';

@Entity({ name: 'cuenta_por_cobrar' })
export class CuentaPorCobrar {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'uuid', nullable: true, name: 'cliente_id' })
  clienteId: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'venta_id' })
  ventaId: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0, name: 'total' })
  total: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0, name: 'saldo' })
  saldo: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDIENTE', name: 'estado' })
  estado: CxcEstado;

  @Column({ type: 'date', nullable: true, name: 'fecha_vencimiento' })
  fechaVencimiento: string | null;

  @Column({ type: 'timestamp with time zone', default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => AbonoCxc, (a) => a.cxc)
  abonos: AbonoCxc[];
}

import { ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'abono_cxc' })
export class AbonoCxc {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => CuentaPorCobrar, (c) => c.abonos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cxc_id' })
  cxc: CuentaPorCobrar;

  @Column({ type: 'uuid', name: 'cxc_id' })
  cxcId: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, name: 'monto' })
  monto: string;

  @Column({ type: 'varchar', length: 120, nullable: true, name: 'referencia' })
  referencia: string | null;

  @Column({ type: 'timestamp with time zone', default: () => 'now()', name: 'created_at' })
  createdAt: Date;
}
