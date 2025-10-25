import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { CompraDetalle } from './compra-detalle.entity';

@Entity('compra')
export class Compra {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Proveedor, proveedor => proveedor.compras)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column()
  proveedor_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => CompraDetalle, compraDetalle => compraDetalle.compra, { cascade: true })
  detalles: CompraDetalle[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
