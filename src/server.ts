import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'
import { env } from './env'

const app = fastify()

app.register(mealsRoutes, { prefix: 'meals' })

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
