import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

enum Priority {
    high,
    regular,
    low
}

export class CreateTodoDto {
    @IsString()
    text: string;

    @IsString()
    @IsOptional()
    body?: string

    @IsEnum(Priority)
    @IsString()
    priority: Priority

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    deadline?: Date

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    remind_at?: Date
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}

export class CreateTodoQueueDto extends CreateTodoDto {
    @IsUUID()
    user_id: string
}

export class ToggleTodoDTO {
    @IsString()
    id: string;
}

export class ToggleTodoQueuePayloadDto extends ToggleTodoDTO {
    @IsString()
    user_id: string
}