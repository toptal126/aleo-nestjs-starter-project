require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'node-fetch';
import { ValidationPipe } from '@nestjs/common';
globalThis.Request = Request;
globalThis.Response = Response;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.APP_PORT || 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
