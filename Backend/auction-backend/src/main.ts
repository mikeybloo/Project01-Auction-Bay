import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/App/app.module';
import cookieParser from 'cookie-parser';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  })

  //Middleware
  app.use(cookieParser());
  app.use('/files', express.static('files'));

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  console.log(`App is listening on: ${await app.getUrl()}`);
}
bootstrap();
