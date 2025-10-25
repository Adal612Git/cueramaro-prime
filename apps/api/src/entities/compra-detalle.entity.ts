import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Compra } from './compra.entity';
import { Producto } from './producto.entity';
import { Lote } from './lote.entity';

@Entity('compra_detalle')
export class CompraDetalle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Compra, compra => compra.detalles)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @Column({ type: 'uuid' })
  compra_id: string;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'uuid' })
  producto_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  importe: number;

  @OneToMany(() => Lote, (lote: Lote) => lote.compra_detalle)
  lotes: Lote[];
}

