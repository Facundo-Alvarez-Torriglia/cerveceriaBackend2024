import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configura CORS
app.enableCors({
  origin: '*' // Esto permite solicitudes desde cualquier origen
});
app.useGlobalPipes(new ValidationPipe({whitelist:true, /*forbidNonWhitelisted:true*/}))
await app.listen(3000);
}
bootstrap();

