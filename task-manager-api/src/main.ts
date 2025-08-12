import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  const port = 3001;
  await app.listen(port);
  console.log(`🚀 Task Manager API is running on http://localhost:${port}`);
}
bootstrap();
