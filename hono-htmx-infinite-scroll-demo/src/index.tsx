import { Hono } from 'hono'
import {faker} from "@faker-js/faker";

const app = new Hono()


const Layout = ({children}) => {
    return <html>
    <head>
        <script src="https://unpkg.com/htmx.org@1.9.9"
                integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX"
                crossOrigin="anonymous"/>
        <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
    </head>
    <body>

    <div class={"container mx-auto"}>
        {children}
    </div>
    </body>
    </html>
}

app.get('/', (c) => c.text('Hello Hono!'))

const SomeJSXComponent = () => {
    return <Layout>
        <div>
            Hi
        </div>
    </Layout>
}

const InfiniteScrollItem = () => {
    return <a
        href="#"
        class="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-2"
    >
  <span
      class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
  ></span>

        <div class="sm:flex sm:justify-between sm:gap-4">
            <div>
                <h3 class="text-lg font-bold text-gray-900 sm:text-xl">
                    {faker.lorem.lines(1)}
                </h3>

                <p class="mt-1 text-xs font-medium text-gray-600">By {faker.person.fullName()}</p>
            </div>

            <div class="hidden sm:block sm:shrink-0">
                <img
                    alt="Paul Clapton"
                    src={faker.image.avatarGitHub()}
                    class="h-16 w-16 rounded-lg object-cover shadow-sm"
                />
            </div>
        </div>

        <div class="mt-4">
            <p class="max-w-[40ch] text-sm text-gray-500">
                {faker.lorem.text()}
            </p>
        </div>
    </a>
}


const Loader = ({page}) => {
    return <div
        hx-get={`/infinite-scroll/users?page=${page}`}
        hx-trigger={"revealed"}
        hx-target={"this"}
        hx-swap={"outerHTML"}
    >
        <span>Loading page {page}</span>
    </div>
}

const infiniteScrollHandler = (context) => {
    // add query to get data from sqlite
    return context.html(
        <Layout>
            <div>
                <InfiniteScrollItem/>
                <InfiniteScrollItem/>

                <Loader page={1}/>

            </div>

        </Layout>
    )
}

const infiniteScrollUsersHandler = (context) => {
    const { page } = context.req.query()
    console.log(page)
    return context.html(
        <>
            <InfiniteScrollItem/>
            <InfiniteScrollItem/>
            <Loader page={parseInt(page) + 1}/>
        </>
    )
}

app.get('/infinite-scroll', infiniteScrollHandler)
app.get('/infinite-scroll/users', infiniteScrollUsersHandler)

export default app
