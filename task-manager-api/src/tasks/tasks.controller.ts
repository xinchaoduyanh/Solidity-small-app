import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query("categoryId") categoryId?: string) {
    if (categoryId) {
      return this.tasksService.findByCategory(+categoryId);
    }
    return this.tasksService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.tasksService.findOne(+id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.tasksService.remove(+id);
  }

  @Put(":id/toggle")
  async toggleComplete(@Param("id") id: string) {
    return this.tasksService.toggleComplete(+id);
  }
}
