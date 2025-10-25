import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'CONTADO' })
  metodoPago: string;

  @CreateDateColumn()
  fecha: Date;

  @Column({ default: 'COMPLETADA' })
  estado: string;
}

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column({ default: 'CONTADO' })
  tipo: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  limiteCredito: number;

  @Column({ default: 'ACTIVO' })
  estadoCredito: string;
}

@Entity() 
export class CuentaPorCobrar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteId: number;

  @Column()
  ventaId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column('decimal', { precision: 10, scale: 2 })
  saldo: number;

  @Column()
  fechaVencimiento: Date;

  @Column({ default: 'PENDIENTE' })
  estado: string;
}