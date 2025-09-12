import knex from 'knex';
import config from './knexfile';
import { User } from 'knex/types/tables';
const db = knex(config);

export const findUserByIdentifier = (identifier: string) => db("users").where("email", identifier).where("is_active", true).orWhere("username", identifier).first();

export const findUserById = (uid: string) =>
    db("users").where("uid", uid).where("is_active", true).first();

export const createUser = (user: User) => db("users").insert(user).returning("*");
