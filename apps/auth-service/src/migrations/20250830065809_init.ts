import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Enable pgcrypto extension
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  // Create users table
  await knex.schema.createTable("users", (table) => {
    table.uuid("uid").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("username", 255).notNullable().unique();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.check("length(password) > 8");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
