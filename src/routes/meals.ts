import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkUserIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const meals = await knex('meals').where('user_id', sessionId).select('*')

    return { meals }
  })

  app.get('/:id', { preHandler: [checkUserIdExists] }, async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const meal = await knex('meals').where({ user_id: sessionId, id }).first()

    return { meal }
  })

  app.get(
    '/metrics',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const totalMeals = await knex('meals')
        .where({ user_id: sessionId })
        .orderBy('date', 'desc')

      const insideDiet = await knex('meals')
        .where({ user_id: sessionId, diet: 'yes' })
        .count('id', { as: 'total' })
        .first()

      const outsideDiet = await knex('meals')
        .where({ user_id: sessionId, diet: 'no' })
        .count('id', { as: 'total' })
        .first()

      const { bestDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.diet === 'yes') {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestDietSequence) {
            acc.bestDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMeals: totalMeals.length,
        insideDiet: insideDiet?.total,
        outsideDiet: outsideDiet?.total,
        bestDietSequence,
      })
    },
  )

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

    let userId = request.cookies.sessionId

    if (!userId) {
      userId = randomUUID()

      reply.cookie('sessionId', userId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date: date.toISOString().split('T')[0],
      hour,
      diet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
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

      const { sessionId } = request.cookies

      const { name, description, date, hour, diet } =
        updateMealBodySchema.parse(request.body)

      await knex('meals')
        .where({ user_id: sessionId, id })
        .update({
          name,
          description,
          date: date.toISOString().split('T')[0],
          hour,
          diet,
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals').where({ user_id: sessionId, id }).del()

      return reply.status(204).send()
    },
  )
}
