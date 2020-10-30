const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')
const { API_TOKEN } = require('../src/config');
const { expect } = require('chai');


describe('Bookmark endpoints', () => {
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

  describe('GET /bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .set({ Authorization: `Bearer ${API_TOKEN}` })
          .expect(200, [])
      })
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
    })

  })

  describe('GET /bookmarks/:bookmarks_id', () => {

    context('Given there are bookmarks', () => {
      const testBookmarks = makeBookmarksArray()

      it('GET /bookmarks/:bookmarks_id reponds with 200 and the specified bookmark', () => {
        const bookmarkId = 2
        const expectedBookmark = testBookmarks[bookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set({ Authorization: `Bearer ${API_TOKEN}` })
          .expect(200, expectedBookmark)
      })
    })

    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bookmarkId = 123456
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(404, { error: { message: `Bookmark doesn't exist` } })
          .done
      })
    })
  })

  describe.only(`POST /bookmarks`, () => {
    it(`creates a bookmark responding with 201 and the new bookmark`, function () {
      this.retries(3)
      const newBookmark = {
        title: 'Test title',
        url: 'https://www.test-url.com',
        description: 'Test bookmark description...',
        rating: 5
      }
      return supertest(app)
        .post('/bookmarks')
        .send(newBookmark)
        // .set({ Authorization: `Bearer ${API_TOKEN}` })

        // .set('Accept', 'application/json')
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.rating).to.eql(newBookmark.rating)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
        })
        .then(res => {
          supertest(app)
            .get(`/bookmarks/${res.body.id}`)
            .expect(res.body)
        })
    })
  })



})

