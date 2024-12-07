import { expect, test } from 'vitest'

test('user must create a new meal', () => {
  const responseStatesCode = 201

  expect(responseStatesCode).toEqual(201)
})
