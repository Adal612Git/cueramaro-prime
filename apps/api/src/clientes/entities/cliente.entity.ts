import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ default: 'CONTADO' })
  tipo: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  limiteCredito: number;

  @Column({ default: 'ACTIVO' })
  estadoCredito: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @Column({ default: true })
  activo: boolean;
}