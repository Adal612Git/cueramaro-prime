import "reflect-metadata";
import { DataSource } from "typeorm";
import { Proveedor } from "./entities/proveedor.entity";
import { Compra } from "./entities/compra.entity";
import { Lote } from "./entities/lote.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 55432,
  username: "postgres",
  password: "password123",
  database: "cueramaro_prime",
  synchronize: false,  // 👈 fuerza a TypeORM a crear las tablas automáticamente
  logging: true,
  entities: [Proveedor, Compra, Lote],
  migrations: [],
});

