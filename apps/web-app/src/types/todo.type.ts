export interface Todo {
    _id: string;
    text: string;
    body: string;
    is_done: boolean;
    done_at?: Date;
    deadline?: Date;
    remind_at?: Date;
    is_deleted: boolean;
    priority: 1 | 2 | 3;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
