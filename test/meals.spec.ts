import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('user can create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'new meal',
        description: 'new meal description',
        date: '2024-12-02',
        hour: '09:00:23',
        diet: 'yes',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'new meal',
      description: 'new meal describe',
      date: '2024-12-03',
      hour: '16:00:00',
      diet: 'no',
    })

    const cookies = createMealResponse.get('Set-Cookie') ?? []

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'new meal',
        description: 'new meal describe',
        date: '2024-12-03',
        hour: '16:00:00',
        diet: 'no',
      }),
    ])
  })
})
