// eslint-disable-next-line @typescript-eslint/no-unused-vars
import knex, { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      date: string
      hour: string
      user_id?: string
    }
  }
}
