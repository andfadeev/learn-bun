import {Elysia} from "elysia";
import {html} from '@elysiajs/html'

let counter = 0

const CounterButtonComponent = ({url, target, icon}) => {
    return <button class={'p-5 rounded bg-gray-300'}
                   hx-post={url}
                   hx-target={target}
                   hx-swap={'outerHTML'}>
        {icon}
    </button>
}

const CounterComponent = ({counter}) => {
    return <div id={'counter'}
                class={counter >= 0
                    ? 'text-green-500 font-bold'
                    : 'text-red-500 font-bold'}>
        {counter}
    </div>
}

const app = new Elysia()
    .use(html())
    .get("/", () => {

        return <html lang="en">
        <head>
            <title>HTMX counter demo</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
                    crossorigin="anonymous"></script>
        </head>
        <body>
        <div class={'container mx-auto'}>
            <h1 class={'text-3xl font-bold underline'}>HTMX counter demo</h1>

            <div class={'flex items-center gap-5 mt-10'}>
                <CounterButtonComponent
                    icon={'-'}
                    target={'#counter'}
                    url={'/dec'}
                />
                <CounterComponent counter={counter}/>
                <CounterButtonComponent
                    icon={'+'}
                    target={'#counter'}
                    url={'/inc'}
                />
            </div>
        </div>
        </body>
        </html>
    })
    .post('/dec', () => {
        counter = counter - 1
        return <CounterComponent counter={counter}/>
    })
    .post('/inc', () => {
        counter = counter + 1
        return <CounterComponent counter={counter}/>
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
