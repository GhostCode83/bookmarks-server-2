const app = require('../src/app')
const knex = require('knex')
const { API_TOKEN } = require('../src/config');
const supertest = require('supertest');
const { makeBookmarksArray } = require('./bookmarks.fixtures');
const { expect } = require('chai');

describe.only('App', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set({ Authorization: `Bearer ${API_TOKEN}` })
      .expect(200, 'Hello, world!')
  })

  context('Given there are bookmarks in the database', () => {
    const testBookmarks = makeBookmarksArray()

    beforeEach('insert bookmarks', () => {
      return db
        .into('bookmarks')
        .insert(testBookmarks)
    })

    it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .set({ Authorization: `Bearer ${API_TOKEN}` })
        .expect(200, testBookmarks)
    })
    it(('GET /bookmarks/:bookmarks_id reponds with 200 and the specified bookmark', () => {
      const bookmarkId = 2
      const expectedBookmark = testBookmarks[bookmarkId - 1]
      return supertest(app)
        .get('/bookmarks/${bookmarkId')
        .set({ Authorization: `Bearer ${API_TOKEN}` })
        .expect(200, expectedBookmark)
    }))

  })

  context('Given no bookmarks', () => {
    it('responds with 200 and an empty list', () => {
      return supertest(app)
        .get('/bookmarks')
        .set({ Authorization: `Bearer ${API_TOKEN}` })
        .expect(200, [])
    })
  })
})
