import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CompraDetalle } from './compra-detalle.entity';
import { Proveedor } from './proveedor.entity';

@Entity('compra')
export class Compra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  proveedor_id: string;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.compras)
  @JoinColumn({ name: "proveedor_id" })
  proveedor: Proveedor;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_compra: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => CompraDetalle, (detalle: CompraDetalle) => detalle.compra, { cascade: true })
  detalles: CompraDetalle[];
}

