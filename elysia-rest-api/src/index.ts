import {Elysia, t} from "elysia";
import {createDb} from "./db";
import {faker} from "@faker-js/faker";

const app = new Elysia()
    .decorate('db', createDb())
    .post("/seed", ({db}) => {
        const insertUser = db.prepare(
            "INSERT INTO users (first_name, last_name, email, about) VALUES ($first_name, $last_name, $email, $about) RETURNING *");

        for (let i = 0; i < 100; i++) {
            const insertedUser = insertUser.get({
                $first_name: faker.person.firstName(),
                $last_name: faker.person.firstName(),
                $email: faker.internet.email(),
                $about: faker.lorem.text()
            })

            console.log(`Inserted user ${insertedUser}`)

        }
        return "done"
    })
    .post("/users", ({body, db}) => {
            console.log("Inserting user to the table")
            const insertUser = db.prepare(
                "INSERT INTO users (first_name, last_name, email, about) VALUES ($first_name, $last_name, $email, $about) RETURNING *");

            const insertedUser = insertUser.get({
                $first_name: body.first_name,
                $last_name: body.last_name,
                $email: body.email,
                $about: body.about || null
            })
            console.log(`Inserted user ${insertedUser}`)
            return insertedUser
        },
        {
            body: t.Object({
                first_name: t.String(),
                last_name: t.String(),
                email: t.String(),
                about: t.Optional(t.String())
            })
        })
    .get("/users/:id", ({params, db}) => {
            const userId = params.id

            return db.query('SELECT * FROM users WHERE user_id = $user_id')
                .get({
                    $user_id: userId
                })
        },
        {
            params: t.Object({
                id: t.Numeric()
            })
        })
    .get("/users",
        ({query, db}) => {
            return db.query("SELECT * FROM users order by first_name desc limit $limit")
                .all({
                    $limit: query.limit
                })
        },
        {
            query: t.Object({
                limit: t.Numeric()
            })
        })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);