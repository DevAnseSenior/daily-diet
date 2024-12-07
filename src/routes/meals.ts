import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const meals = await knex('meals').select('*')

    return meals
  })
}
