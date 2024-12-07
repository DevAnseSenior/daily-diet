import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)
app.register(mealsRoutes, { prefix: 'meals' })
