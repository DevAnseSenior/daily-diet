import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'
import { env } from './env'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(mealsRoutes, { prefix: 'meals' })

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
