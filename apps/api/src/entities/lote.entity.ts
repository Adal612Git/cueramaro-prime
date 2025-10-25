import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { CompraDetalle } from './compra-detalle.entity';

@Entity('lote')
export class Lote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo_lote: string;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'uuid' })
  producto_id: string;

  @ManyToOne(() => CompraDetalle, (compraDetalle: CompraDetalle) => compraDetalle.lotes)
  @JoinColumn({ name: 'compra_detalle_id' })
  compra_detalle: CompraDetalle;

  @Column({ type: 'uuid', nullable: true })
  compra_detalle_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad_original: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad_actual: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_entrada: Date;

  @Column({ type: 'date', nullable: true })
  fecha_caducidad: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_compra: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

