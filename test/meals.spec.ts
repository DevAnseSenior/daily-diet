import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

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

  it('should be able to get a especific meal', async () => {
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

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'new meal',
        description: 'new meal describe',
        date: '2024-12-03',
        hour: '16:00:00',
        diet: 'no',
      }),
    )
  })

  it('should be able to update a meal', async () => {
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

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .send({
        name: 'Pizza Bacon',
        description: 'stop on Pizza Hut',
        date: '2024-11-27',
        hour: '19:55:34',
        diet: 'no',
      })
      .set('Cookie', cookies)
      .expect(204)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Pizza Bacon',
        description: 'stop on Pizza Hut',
        date: '2024-11-27',
        hour: '19:55:34',
        diet: 'no',
      }),
    )
  })

  it('should be able to delete a meal', async () => {
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

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(expect.objectContaining({}))
  })

  it('should be able to get metrics from diet', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'meal 1',
      description: 'meal 1 describe',
      date: '2024-12-03',
      hour: '09:00:00',
      diet: 'no',
    })

    const cookies = createMealResponse.get('Set-Cookie') ?? []

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'meal 2',
      description: 'meal 2 describe',
      date: '2024-12-03',
      hour: '11:20:00',
      diet: 'yes',
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'meal 3',
      description: 'meal 3 describe',
      date: '2024-12-03',
      hour: '12:03:00',
      diet: 'yes',
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'meal 4',
      description: 'meal 4 describe',
      date: '2024-12-03',
      hour: '15:12:00',
      diet: 'yes',
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'meal 5',
      description: 'meal 5 describe',
      date: '2024-12-03',
      hour: '18:00:00',
      diet: 'no',
    })

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMeals: 5,
      insideDiet: 3,
      outsideDiet: 2,
      bestDietSequence: 3,
    })
  })
})
