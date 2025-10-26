import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Post, Body, BadRequestException, HttpCode, Param } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { randomUUID } from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

@Controller()
class AppController {
  @Get('health')
  health() {
    return { status: 'ok', version: process.env.APP_VERSION || '0.0.0' };
    }

  @Get('productos')
  async productos() {
    const fallback = [
      { id: '10000000-0000-0000-0000-000000000001', sku: 'RES-001', name: 'Res', base_price: 180.0 },
      { id: '10000000-0000-0000-0000-000000000002', sku: 'CER-001', name: 'Cerdo', base_price: 140.0 },
      { id: '10000000-0000-0000-0000-000000000003', sku: 'POL-001', name: 'Pollo', base_price: 110.0 },
      { id: '10000000-0000-0000-0000-000000000004', sku: 'CHO-001', name: 'Chorizo', base_price: 160.0 },
      { id: '10000000-0000-0000-0000-000000000005', sku: 'PES-001', name: 'Pescado', base_price: 190.0 }
    ];
    try {
      const pg = await import('pg');
      const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      const res = await client.query('SELECT id, sku, name, base_price FROM products ORDER BY name ASC');
      await client.end();
      return res.rows;
    } catch {
      return fallback;
    }
  }

  @Post('ventas')
  @HttpCode(201)
  async createVenta(@Body() body: any) {
    if (!body || !Array.isArray(body.items)) {
      throw new BadRequestException('payload inválido: se espera { items: [...] }');
    }
    const id = randomUUID();
    const items = body.items;
    const clienteId = body.cliente_id || null;
    const formaPago = String(body.forma_pago || '').toLowerCase();
    const isCredito = formaPago === 'credito' || body.credit === true;
    const total = Array.isArray(items)
      ? items.reduce((sum: number, it: any) => sum + Number(it.price || 0) * Number(it.kg || it.quantity || 0), 0)
      : 0;

    // Try to persist into DB (best-effort)
    try {
      const pg = await import('pg');
      const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      await client.query(
        'INSERT INTO ventas (id, cliente_id, items, total) VALUES ($1, $2, $3::jsonb, $4)',
        [id, clienteId, JSON.stringify(items), total]
      );
      if (isCredito) {
        await client.query(
          'INSERT INTO cxc (venta_id, amount_due, due_date, status) VALUES ($1, $2, NOW() + interval \'7 days\', \'pending\') ON CONFLICT (venta_id) DO NOTHING',
          [id, total]
        );
      }
      await client.end();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[api] venta persisted skipped:', (e as Error).message);
    }

    return { id, status: 'created', items };
  }

  @Post('clientes')
  @HttpCode(201)
  async createCliente(@Body() body: any) {
    if (!body || !body.name) throw new BadRequestException('name requerido');
    try {
      const pg = await import('pg');
      const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      const id = randomUUID();
      await client.query(
        'INSERT INTO clientes (id, name, email, phone) VALUES ($1,$2,$3,$4)',
        [id, body.name, body.email || null, body.phone || null]
      );
      await client.end();
      return { id };
    } catch (e) {
      throw new BadRequestException('No se pudo crear cliente');
    }
  }

  @Get('cxc/:ventaId')
  async getCxc(@Param('ventaId') ventaId: string) {
    try {
      const pg = await import('pg');
      const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      const res = await client.query('SELECT venta_id, amount_due, status, due_date FROM cxc WHERE venta_id=$1', [ventaId]);
      await client.end();
      if (res.rows.length === 0) return { venta_id: ventaId, status: 'none' };
      return res.rows[0];
    } catch (e) {
      throw new BadRequestException('No se pudo obtener CxC');
    }
  }

  @Post('cxc/abono')
  @HttpCode(201)
  async abono(@Body() body: any) {
    const ventaId = body?.venta_id;
    const amount = Number(body?.amount || 0);
    if (!ventaId || !(amount > 0)) throw new BadRequestException('venta_id y amount > 0 requeridos');
    try {
      const pg = await import('pg');
      const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      await client.query('UPDATE cxc SET amount_due = GREATEST(amount_due - $1,0), status = CASE WHEN amount_due - $1 <= 0 THEN \'paid\' ELSE status END WHERE venta_id=$2', [amount, ventaId]);
      const res = await client.query('SELECT venta_id, amount_due, status FROM cxc WHERE venta_id=$1', [ventaId]);
      await client.end();
      return res.rows[0] || { venta_id: ventaId, status: 'none' };
    } catch (e) {
      throw new BadRequestException('No se pudo registrar abono');
    }
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

async function tryDbConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) { return; }
  try {
    // Dynamic import to avoid hard dependency at build time
    const pg = await import('pg');
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    // eslint-disable-next-line no-console
    console.log('[api] DB check ok');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[api] DB check skipped/failure:', (err as Error).message);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });

  // Body size limits
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // CORS configuration
  const origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5174')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins, credentials: true });

  const port = Number(process.env.PORT || process.env.PORT_API || 3000);
  await tryDbConnection();
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`[api] listening on :${port}`);
}

bootstrap();
