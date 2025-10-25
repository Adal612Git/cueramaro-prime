import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AltDashboardController } from './alt-dashboard.controller';
import { AltDashboardService } from './alt-dashboard.service';

@Module({
  imports: [
    // TypeOrmModule comentado temporalmente
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'cueramaro_prime',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController, AltDashboardController],
  providers: [AppService, AltDashboardService],
})
export class AppModule {}
