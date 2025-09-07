import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from 'src/schemas/todo.schema';
import { CreateTodoQueueDto } from './todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject('TODO_MODEL')
    private readonly todoModel: Model<Todo>,
  ) { }

  async createTodo(body: CreateTodoQueueDto): Promise<Todo> {
    return this.todoModel.create({
      ...body,
    });
  }

  async getTodos(limit = 10, hideCompleted: boolean = false, user_id: string): Promise<Todo[]> {
    const query: Record<string, any> = { is_deleted: false }

    if (hideCompleted) {
      query.is_done = false;
    }

    return this.todoModel
      .find({ ...query, user_id: user_id })
      .sort({ is_done: 1, priorityOrder: -1, updated_at: -1 })
      .limit(limit)
      .exec();
  }


  async toggleDone(todoId: string, userId: string): Promise<Todo | null> {
    const todo = await this.todoModel.findById(todoId);

    if (!todo || todo.user_id != userId) return null;

    if (todo.is_done) {
      todo.done_at = undefined;
    } else {
      todo.done_at = new Date()
    }

    todo.is_done = !todo.is_done;

    todo.updated_at = new Date();
    return todo.save();
  }
}
