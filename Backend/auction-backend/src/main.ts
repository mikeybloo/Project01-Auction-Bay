import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 8080
  await app.listen(PORT);

  console.log(`App is listening on: ${await app.getUrl()}`)
}
bootstrap();
