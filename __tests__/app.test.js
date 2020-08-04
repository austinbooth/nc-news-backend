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
      it("GET: 200 - responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                  slug: expect.any(String),
                })
              );
            });
          });
      });
    });
    describe("/users", () => {
      it("GET: 200 - responds with the correct user", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny",
              })
            );
          });
      });
      it("GET: 404 - responds with an appropriate error code and message when a valid but non-existent username is given", () => {
        return request(app)
          .get("/api/users/hello")
          .expect(404)
          .then(({ body: { msg } }) => expect(msg).toBe("User not found"));
      });
    });
    describe("/articles", () => {
      it("GET: 200 - responds with an article when given a valid article id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: new Date(1542284514171).toISOString(),
                votes: 100,
                comment_count: 13,
              })
            );
          });
      });
    });
  });
});
