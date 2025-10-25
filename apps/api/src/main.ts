import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración global
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  // Puerto
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  // Logs sin emojis problemáticos
  console.log("🚀 API running on: http://localhost:" + port);
  console.log("📡 Also available on: http://0.0.0.0:" + port);
}

bootstrap();
