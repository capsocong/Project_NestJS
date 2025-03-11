import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('My Api')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('ProjectDemo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get('PORT');
  await app.listen(port);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
