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
            expect(Array.isArray(topics)).toBe(true);
            expect(topics.length).toBe(3);
            expect(topics[0]).toEqual(
              expect.objectContaining({
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              })
            );
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
      it("GET: 404 - responds with an appropriate error when given a valid but non-existent article id", () => {
        return request(app)
          .get("/api/articles/9999")
          .expect(404)
          .then(({ body: { msg } }) => expect(msg).toBe("Article not found"));
      });
      it("GET: 400 - responds with an appropriate error when given an invalid article_id", () => {
        return request(app)
          .get("/api/articles/pie")
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toBe("Invalid article id"));
      });
      it("PATCH: 200 - responds with an article, with the votes incremented correctly", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                votes: 105,
                article_id: 1,
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                title: "Living in the shadow of a great man",
                topic: "mitch",
              })
            );
          });
      });
      it("PATCH: 200 - responds with an article, with the votes decremented correctly", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                votes: 90,
                article_id: 1,
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2018-11-15T12:21:54.171Z",
                title: "Living in the shadow of a great man",
                topic: "mitch",
              })
            );
          });
      });
      it("PATCH: 404 - responds with an appropriate error when given a valid but non-existent article id", () => {
        return request(app)
          .patch("/api/articles/9999")
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body: { msg } }) => expect(msg).toBe("Article not found"));
      });
      it("PATCH: 400 - responds with an appropriate error when given an invalid article_id", () => {
        return request(app)
          .patch("/api/articles/sausage")
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toBe("Invalid article id"));
      });
      describe("/articles/:article_id/comments", () => {
        it("POST: 201 - inserts a comment into the db and returns it", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge", body: "New comment" })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: 19,
                  author: "butter_bridge",
                  article_id: 1,
                  votes: 0,
                  created_at: expect.any(String),
                  body: "New comment",
                })
              );
            });
        });
        it("POST: 404 - responds with an appropriate error when given a valid but non-existent article id", () => {
          return request(app)
            .post("/api/articles/999/comments")
            .send({ username: "butter_bridge", body: "New comment" })
            .expect(404)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid article id")
            );
        });
        it("POST: 400 - responds with an appropriate error when given an invalid article_id", () => {
          return request(app)
            .post("/api/articles/iseedeadpeople/comments")
            .send({ username: "butter_bridge", body: "New comment" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid article id")
            );
        });
        it("POST: 404 - responds with an appropriate error when given a non-existent username in payload", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter", body: "New comment" })
            .expect(404)
            .then(({ body: { msg } }) => expect(msg).toBe("Invalid username"));
        });
        it("POST: 400 - responds with an appropriate error when given a payload with the correct keys but the username is an empty string", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "", body: "New comment" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid - username not given")
            );
        });
        it("POST: 400 - responds with an appropriate error when given a payload with the correct keys but the body is an empty string", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge", body: "" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid - body not given")
            );
        });
        it("POST: 400 - responds with an appropriate error when given a payload with the username key missing", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ body: "New comment" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid - username not given")
            );
        });
        it("POST: 400 - responds with an appropriate error when given a payload with the body key missing", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid - body not given")
            );
        });
        // it("GET: 200 - responds with all the comments for the given article_id", () => {
        //   return request(app).get("/api/articles/1/comments").expect(200);
        // });
      });
    });
  });
});
