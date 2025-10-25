import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'cuenta_bancaria' })
export class CuentaBancaria {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'varchar', length: 120, name: 'nombre' }) nombre: string;
  @Column({ type: 'varchar', length: 60, nullable: true, name: 'numero' }) numero: string | null;
  @Column({ type: 'varchar', length: 60, nullable: true, name: 'banco' }) banco: string | null;
}

@Entity({ name: 'gasto' })
export class Gasto {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'date', name: 'fecha' }) fecha: string;
  @Column({ type: 'numeric', precision: 14, scale: 2, name: 'monto' }) monto: string;
  @Column({ type: 'varchar', length: 80, name: 'categoria' }) categoria: string;
  @Column({ type: 'text', nullable: true, name: 'descripcion' }) descripcion: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'comprobante_url' }) comprobanteUrl: string | null;
  @Column({ type: 'uuid', nullable: true, name: 'cuenta_id' }) cuentaId: string | null;
}

@Entity({ name: 'ingreso_bancario' })
export class IngresoBancario {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', name: 'cuenta_id' }) cuentaId: string;
  @Column({ type: 'date', name: 'fecha' }) fecha: string;
  @Column({ type: 'numeric', precision: 14, scale: 2, name: 'monto' }) monto: string;
  @Column({ type: 'varchar', length: 120, nullable: true, name: 'referencia' }) referencia: string | null;
}
