import { Hono } from 'hono'
import { faker } from '@faker-js/faker';

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

const HomePage = () => {
    return <Layout>
        <div>
            <h1 class="text-3xl font-bold underline">Home page</h1>
            <ul> 
            <li>
                <a href={"/infinite-scroll"}>Infinite scroll</a>
            </li>
            </ul>
        </div>
    </Layout>
}

const InfiniteScrollPage = () => {
    return <Layout>
        <div>
            <h1 class={"text-3xl font-bold underline"}>Infinite scroll</h1>
            <div>
                <UserCardComponent></UserCardComponent>
                <UserCardComponent></UserCardComponent>
                <UserCardComponent></UserCardComponent>

                <Loader page={1}/>
            </div>
        </div>
    </Layout>
}

const UserCardComponent = () => {
    return <a
        href="#"
        class="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mt-2"
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
                    alt={faker.person.fullName()}
                    src={faker.image.avatar()}
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

const UsersPage = ({page}) => {
    return <>
        <UserCardComponent></UserCardComponent>
        <UserCardComponent></UserCardComponent>
        <UserCardComponent></UserCardComponent>
        <Loader page={page + 1}/>
    </>
}

const homePageHandler = (context) => {
    return context.html(<HomePage/>)
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

app.get('/', homePageHandler)

app.get('/infinite-scroll', (c) => c.html(<InfiniteScrollPage/>))

app.get('/infinite-scroll/users', (c) => {
    const { page } = c.req.query()
    console.log(page)
    return c.html(<UsersPage page={parseInt(page)}/>)
})

export default {
    port: 3000,
    fetch: app.fetch
};
