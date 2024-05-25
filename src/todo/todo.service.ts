import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Todo } from './entities/todo.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodoService {

  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    try {
      const todo = await this.todoModel.create(createTodoDto);
      return todo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.todoModel.find();
  }

  async findOne(id: string) {
    let todo: Todo;

    if (isValidObjectId(id)) {
      todo = await this.todoModel.findById(id);
    }

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true });
      return todo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async complete(id: string) {
    try {
      const todo = await this.todoModel.findByIdAndUpdate(id, { completed: true, }, { new: true });
      return todo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.todoModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Todo with id ${id} not found`);
    }
    
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Todo exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Todo - Check server logs`);
  }
}
