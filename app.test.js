const request = require("supertest")
const app = require("./app")

describe('Root', () => {
  test('Loads', () => {
    request(app).
      get("/").
      then(r => {
        // status 200, no error
        expect(r.statusCode).toBe(200)
      })
  })
})
