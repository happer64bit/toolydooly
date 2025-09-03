import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateTodoDto, CreateTodoQueueDto, ToggleTodoDTO, ToggleTodoQueuePayloadDto } from './todo.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.decoration';
import { type IUser } from 'src/user/user.type';
import { TodoService } from './todo.service';

@Controller()
export class TodoController {
    constructor(
        @Inject('RABBIT_MQ') private readonly rabbitClient: ClientProxy,
        private readonly todoService: TodoService,
    ) { }


    @Post()
    @UseGuards(AuthGuard)
    async createTodo(
        @Body() createTodoDto: CreateTodoDto,
        @User() user: IUser,
    ) {
        try {
            const payload: CreateTodoQueueDto = {
                ...createTodoDto,
                user_id: user.uid,
            };
            return await lastValueFrom(
                this.rabbitClient.send({ cmd: 'todo.create' }, payload),
            );
        } catch (err) {
            throw new HttpException(
                'Failed to create todo: ' + err.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    @UseGuards(AuthGuard)
    async listTodos(
        @Query('page') page = '0',
        @Query('limit') limit = '10',
    ) {
        try {
            const pageNum = parseInt(page, 10) || 0;
            const limitNum = parseInt(limit, 10) || 10;

            return await this.todoService.getTodos(pageNum, limitNum);
        } catch (err) {
            throw new HttpException(
                'Failed to fetch todos: ' + err.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put("/toggle")
    @UseGuards(AuthGuard)
    async toggleTodo(@User() user: IUser, @Body() body: ToggleTodoDTO) {
        try {
            const todo = await lastValueFrom(
                this.rabbitClient.send(
                    { cmd: 'todo.toggle_done' },
                    { ...body, user_id: user.uid } satisfies ToggleTodoQueuePayloadDto
                )
            );

            if(!todo) {
                throw new Error("Maybe you are not authroized to do this")
            }

            return todo;
        } catch (err) {
            throw new HttpException(
                err.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @MessagePattern({ cmd: 'todo.create' })
    async handleCreateTodo(@Payload() payload: CreateTodoQueueDto) {
        return await this.todoService.createTodo(payload);
    }

    @MessagePattern({ cmd: 'todo.toggle_done' })
    async handleToggleTodoDone(@Payload() payload: ToggleTodoQueuePayloadDto) {
        return await this.todoService.toggleDone(payload.id, payload.user_id);
    }
}
