import { afterAll, beforeAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('user must create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'new meal',
        description: 'new meal description',
        data: '2024-12-02',
        hour: '09:00:23',
        diet: 'yes',
      })
      .expect(201)
  })
})
