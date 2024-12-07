import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals').select('*')

    return { meals }
  })

  app.get('/:id', async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    return { meal }
  })

  app.get('/metrics', async (request, reply) => {
    const totalMeals = await knex('meals').count('id', { as: 'total' })

    const insideDiet = await knex('meals')
      .where({ diet: 'yes' })
      .count('id', { as: 'total' })

    const outsideDiet = await knex('meals')
      .where({ diet: 'no' })
      .count('id', { as: 'total' })

    // const { bestDietSequence } = totalMeals.reduce((acc, meal) => {
    //   if (meal.) {
    //   }
    // })

    return reply.send({ totalMeals, insideDiet, outsideDiet })
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid date format. Expected ISO 8601 string.',
        })
        .transform((date) => new Date(date)),
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
      date: date.toISOString().split('T')[0],
      hour,
      diet,
    })

    return reply.status(200).send()
  })

  app.put('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid date format. Expected ISO 8601 string.',
        })
        .transform((date) => new Date(date)),
      hour: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
          'Invalid time format. Expected HH:mm:ss.',
        ),
      diet: z.enum(['yes', 'no']),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const { name, description, date, hour, diet } = updateMealBodySchema.parse(
      request.body,
    )

    await knex('meals')
      .where('id', id)
      .update({
        name,
        description,
        date: date.toISOString().split('T')[0],
        hour,
        diet,
      })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    await knex('meals').where('id', id).del()

    return reply.status(204).send()
  })
}
