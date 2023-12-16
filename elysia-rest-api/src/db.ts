import Database from "bun:sqlite";
import {getMigrations, migrate} from "bun-sqlite-migrations";

export const createDb = () => {
    const db = new Database("elysia-rest-api.db")
    migrate(db, getMigrations('./migrations'))
    return db
}
