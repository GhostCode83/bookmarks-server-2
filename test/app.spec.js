const app = require('../src/app')
const knex = require('knex')
const { API_TOKEN } = require('../src/config');
const supertest = require('supertest');
const { makeBookmarksArray } = require('./bookmarks.fixtures');
const { expect } = require('chai');

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set({ Authorization: `Bearer ${API_TOKEN}` })
      .expect(200, 'Hello, world!')
  })
})
