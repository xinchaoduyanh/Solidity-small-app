import { Module } from "@nestjs/common";
import { CategoriesModule } from "./categories/categories.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [CategoriesModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
