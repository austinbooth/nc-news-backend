const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");

describe("app", () => {
  beforeEach(() => {
    return db.seed.run();
  });
  afterAll(() => {
    return db.destroy();
  });
  describe("/api", () => {
    describe("/topics", () => {
      test("GET: 200 - responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach((topic) => {
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              });
            });
          });
      });
    });
  });
});
