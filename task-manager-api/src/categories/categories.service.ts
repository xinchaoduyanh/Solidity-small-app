import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  createdAt?: Date;
}

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    { id: 1, name: 'General', description: 'General tasks', color: '#FF6B6B' },
    { id: 2, name: 'Work', description: 'Work related tasks', color: '#4ECDC4' },
    { id: 3, name: 'Personal', description: 'Personal tasks', color: '#45B7D1' },
    { id: 4, name: 'Study', description: 'Study and learning tasks', color: '#96CEB4' },
    { id: 5, name: 'Health', description: 'Health and fitness tasks', color: '#FFEAA7' },
  ];

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: number): Category {
    const category = this.categories.find(cat => cat.id === id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  create(createCategoryDto: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: this.categories.length + 1,
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      color: createCategoryDto.color || '#000000',
      createdAt: new Date(),
    };
    
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): Category {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    this.categories[index] = {
      ...this.categories[index],
      ...updateCategoryDto,
    };

    return this.categories[index];
  }

  remove(id: number): void {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    this.categories.splice(index, 1);
  }
}
