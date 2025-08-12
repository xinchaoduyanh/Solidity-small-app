import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, UpdateTaskDto } from "./dto";

export interface Task {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: "Complete project documentation",
      description:
        "Write comprehensive documentation for the task manager project",
      categoryId: 2,
      status: "in_progress",
      priority: "high",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      title: "Review code changes",
      description: "Review pull requests and provide feedback",
      categoryId: 2,
      status: "pending",
      priority: "medium",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: 3,
      title: "Exercise routine",
      description: "Complete 30-minute workout session",
      categoryId: 5,
      status: "completed",
      priority: "medium",
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
    },
    {
      id: 4,
      title: "Study blockchain concepts",
      description: "Learn about smart contracts and Solidity",
      categoryId: 4,
      status: "in_progress",
      priority: "high",
      createdAt: new Date("2024-01-04"),
      updatedAt: new Date("2024-01-04"),
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  findByCategory(categoryId: number): Task[] {
    return this.tasks.filter((task) => task.categoryId === categoryId);
  }

  create(createTaskDto: CreateTaskDto): Task {
    const newTask: Task = {
      id: this.tasks.length + 1,
      title: createTaskDto.title,
      description: createTaskDto.description,
      categoryId: createTaskDto.categoryId,
      status: createTaskDto.status || "pending",
      priority: createTaskDto.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    this.tasks[index] = {
      ...this.tasks[index],
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    return this.tasks[index];
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    this.tasks.splice(index, 1);
  }

  toggleComplete(id: number): Task {
    const task = this.findOne(id);
    task.status = task.status === "completed" ? "pending" : "completed";
    task.updatedAt = new Date();
    return task;
  }
}
