import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from 'src/schemas/todo.schema';
import { CreateTodoQueueDto } from './todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject('TODO_MODEL')
    private readonly todoModel: Model<Todo>,
  ) {}

  async createTodo(body: CreateTodoQueueDto): Promise<Todo> {
    return this.todoModel.create({
      ...body,
    });
  }

  async getTodos(
    page = 0,
    limit = 10,
  ): Promise<Todo[]> {
    return this.todoModel
      .find({ is_deleted: false })
      .skip(page * limit)
      .limit(limit)
      .sort({ created_at: -1 })
      .exec();
  }

  async toggleDone(todoId: string, userId: string): Promise<Todo | null> {
    const todo = await this.todoModel.findById(todoId);
    
    if (!todo || todo.user_id != userId) return null;

    if(todo.is_done) {
        todo.done_at = undefined;
    } else {
        todo.done_at = new Date()
    }

    todo.is_done = !todo.is_done;

    todo.updated_at = new Date();
    return todo.save();
  }
}
