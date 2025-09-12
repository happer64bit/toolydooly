import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { Todo } from 'src/schemas/todo.schema';
import { CreateTodoQueueDto, UpdateTodoQueueDto } from './todo.dto';

@Injectable()
export class TodoService {
  constructor(@Inject('TODO_MODEL') private readonly todoModel: Model<Todo>) { }

  async createTodo(body: CreateTodoQueueDto): Promise<Todo> {
    return this.todoModel.create(body);
  }

  async getTodos(
    hideCompleted = false,
    user_id: string,
    search_query?: string
  ): Promise<Todo[]> {
    const query: Record<string, any> = { is_deleted: false, user_id };

    if (hideCompleted) query.is_done = false;
    if (search_query) {
      query.$or = [
        { $text: { $search: search_query } },
        { text: { $regex: search_query, $options: 'i' } }
      ];
    }
    
    return this.todoModel
      .find(query)
      .sort({ is_done: 1, priorityOrder: -1, updated_at: -1 })
      .exec();
  }

  private async findTodo(todoId: string, userId: string): Promise<Todo> {
    if (!isValidObjectId(todoId)) throw new NotFoundException('Todo not found');

    const todo = await this.todoModel.findOne({ _id: todoId, is_deleted: false });
    if (!todo || todo.user_id !== userId) throw new NotFoundException('Todo not found or unauthorized');

    return todo;
  }

  async toggleDone(todoId: string, userId: string): Promise<Todo> {
    const todo = await this.findTodo(todoId, userId);
    const updated = await this.todoModel.findByIdAndUpdate(
      todoId,
      {
        is_done: !todo.is_done,
        done_at: !todo.is_done ? new Date() : undefined,
        updated_at: new Date(),
      },
      { new: true }
    );
    return updated!;
  }

  async deleteTodo(todoId: string, userId: string): Promise<{ success: boolean }> {
    await this.findTodo(todoId, userId);
    await this.todoModel.updateOne(
      { _id: todoId },
      { is_deleted: true, updated_at: new Date() }
    );
    return { success: true };
  }

  async updateTodo(todoId: string, userId: string, payload: UpdateTodoQueueDto): Promise<Todo> {
    const updateData: Partial<Todo> = { updated_at: new Date() };
    if (payload.text !== undefined) updateData.text = payload.text;
    if (payload.priority !== undefined) updateData.priority = payload.priority;

    const updated = await this.todoModel.findOneAndUpdate(
      { _id: todoId, is_deleted: false, user_id: userId },
      updateData,
      { new: true }
    );

    if (!updated) throw new NotFoundException('Todo not found or unauthorized');
    return updated;
  }
}
