import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CompraDetalle } from '../../compras/entities/compra-detalle.entity';

@Entity()
export class Lote {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  codigo_lote: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_compra: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precio_venta: number;

  @Column('int')
  cantidad_inicial: number;

  @Column('int')
  cantidad_actual: number;

  @Column('datetime')
  fecha_entrada: Date;

  @Column('datetime', { nullable: true })
  fecha_caducidad: Date;

  @Column({ type: 'varchar', default: 'DISPONIBLE' })
  estado: string;

  @ManyToOne(() => CompraDetalle, compraDetalle => compraDetalle.lotes)
  @JoinColumn({ name: 'compra_detalle_id' })
  compra_detalle: CompraDetalle;

  @Column()
  compra_detalle_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
