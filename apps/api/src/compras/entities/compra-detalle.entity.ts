import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany 
} from 'typeorm';
import { Compra } from './compra.entity';
import { Producto } from './producto.entity';
import { Lote } from '../../lotes/entities/lote.entity';

@Entity('compra_detalle')
export class CompraDetalle {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Compra, compra => compra.detalles)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @Column()
  compra_id: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column()
  producto_id: number;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @OneToMany(() => Lote, lote => lote.compra_detalle)
  lotes: Lote[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
