import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string().transform((val) => new Date(val)),
      hour: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
          'Invalid time format. Expected HH:mm:ss.',
        ),
      diet: z.enum(['yes', 'no']),
    })

    const { name, description, date, hour, diet } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date,
      hour,
      diet,
    })

    return reply.status(200).send()
  })
}
