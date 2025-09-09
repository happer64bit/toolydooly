import knex from 'knex';
import config from './knexfile';
const db = knex(config);

export const findUserByIdentifier = (identifier: string) => db("users").where("email", identifier).where("is_active", true).orWhere("username", identifier).first();

export const findUserById = (uid: string) =>
    db("users").where("uid", uid).where("is_active", true).first();

export const upsertUserInDb = (user: { username: string; email: string; password: string }) =>
    db("users")
        .insert(user)
        .onConflict(["email", "username"])
        .merge()
        .returning("*");
