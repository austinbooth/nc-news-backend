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
    it("GET: 200 - responds with JSON describing all API endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toHaveProperty("GET /api");
          expect(endpoints).toHaveProperty("GET /api/topics");
          // expect(endpoints).toHaveProperty("GET /api/users/:username");
          expect(endpoints).toHaveProperty("GET /api/articles");
          // expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
          // expect(endpoints).toHaveProperty("PATCH /api/articles/:article_id");
          // expect(endpoints).toHaveProperty(
          //   "POST /api/articles/:article_id/comments"
          // );
          // expect(endpoints).toHaveProperty("/api/comments");
        });
    });
    it("ALL METHODS - repsponds with an appropriate error message when an invalid API endpoint is requested", () => {
      return request(app)
        .get("/api/xyz")
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toBe("Path not found"));
    });
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
      it("Invalid methods: 405 - responds with an appropriate error", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Method not allowed")
            );
        });
        return Promise.all(promises);
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
      it("Invalid methods: 405 - responds with an appropriate error", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/users")
            .expect(405)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Method not allowed")
            );
        });
        return Promise.all(promises);
      });
    });
    describe("/articles", () => {
      it("GET: 200 - responds with an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);
            expect(articles.length).toBe(12);
            expect(articles[0]).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
            expect(articles[0]).not.toHaveProperty("body");
          });
      });
      it("GET: 200 - default sorts the array objects by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) =>
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            })
          );
      });
      it("GET: 200 - default sorts the array objects by date in ascending order when given 'order' as a query", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) =>
            expect(articles).toBeSortedBy("created_at", {
              descending: false,
            })
          );
      });
      it("GET: 200 - sorts the array objects by all columns where values are returned as strings", () => {
        const cols = ["author", "title", "topic", "votes"];
        const promises = cols.map((col) => {
          return request(app)
            .get(`/api/articles?sort_by=${col}`)
            .expect(200)
            .then(({ body: { articles } }) =>
              expect(articles).toBeSortedBy(col, {
                descending: true,
              })
            );
        });
        return Promise.all(promises);
      });
      it("GET: 200 - sorts the array objects by all columns where values are returned as numbers", () => {
        const cols = ["article_id", "created_at", "comment_count"];
        const promises = cols.map((col) => {
          return request(app)
            .get(`/api/articles?sort_by=${col}`)
            .expect(200)
            .then(({ body: { articles } }) =>
              expect(articles).toBeSortedBy(col, {
                descending: true,
                coerce: true,
              })
            );
        });
        return Promise.all(promises);
      });
      it("GET: 400 - returns an appropriate error message for an invalid value for sort_by", () => {
        return request(app)
          .get("/api/articles?sort_by=hello")
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toBe("Invalid column"));
      });
      it("GET: 400 - returns an appropriate error message for an invalid value for order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=pie")
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toBe("Invalid query"));
      });
      it("GET: 200 - returns articles by specific author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);
            expect(articles.length).toBe(3);
          });
      });
      it("GET: 200 - returns articles by specific topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);
            expect(articles.length).toBe(11);
          });
      });
      it("GET: 404 - returns an appropriate error message when given a topic which doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=mitchh")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Topic not found");
          });
      });
      it("GET: 404 - returns an appropriate error message when given an author which doesn't exist", () => {
        return request(app)
          .get("/api/articles?author=mitchh")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article or author not found");
          });
      });
      it("Invalid methods: 405 - responds with an appropriate error", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const promises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Method not allowed")
            );
        });
        return Promise.all(promises);
      });
      describe("/articles/:article_id", () => {
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
                  comment_count: "13",
                })
              );
            });
        });
        it("GET: 200 - responds with the correct article details when given an article id which has zero comments - testing join works when article has no comments", () => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: "icellusedkars",
                  title: "Sony Vaio; or, The Laptop",
                  article_id: 2,
                  body: expect.any(String),
                  topic: "mitch",
                  created_at: expect.any(String),
                  votes: 0,
                  comment_count: "0",
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
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid article id")
            );
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
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid article id")
            );
        });
        it("PATCH: 200 - does nothing when the payload is an empty object", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  votes: 100,
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
        it("PATCH: 200 - does nothing when the payload is omitted", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  votes: 100,
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
        it("PATCH: 200 - does nothing when the payload votes is omitted (empty string)", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ votes: "" })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  votes: 100,
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
        it("PATCH: 200 - does nothing when the payload votes is a string instead of a number (empty string)", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ votes: "hello" })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  votes: 100,
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
        it("Invalid methods: 405 - responds with an appropriate error", () => {
          const invalidMethods = ["post", "put", "delete"];
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(({ body: { msg } }) =>
                expect(msg).toBe("Method not allowed")
              );
          });
          return Promise.all(promises);
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
              .then(({ body: { msg } }) =>
                expect(msg).toBe("Invalid username")
              );
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
          it("GET: 200 - responds with all the comments for the given article_id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(13);
                expect(comments[0]).toEqual(
                  expect.objectContaining({
                    comment_id: 2,
                    author: "butter_bridge",
                    article_id: 1,
                    votes: 14,
                    created_at: "2016-11-22T12:36:03.389Z",
                    body:
                      "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                  })
                );
              });
          });
          it("GET: 200 - responds with an empty array when there are no comments for an article_id which exists", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(0);
              });
          });
          it("GET: 404 - responds with an appropriate error when a valid but non-existent article_id is used", () => {
            return request(app)
              .get("/api/articles/999/comments")
              .expect(404)
              .then(({ body: { msg } }) =>
                expect(msg).toBe("Article or author not found")
              );
          });
          it("GET: 400 - responds with an appropriate error when an invalid article_id is used", () => {
            return request(app)
              .get("/api/articles/ilovejs/comments")
              .expect(400)
              .then(({ body: { msg } }) =>
                expect(msg).toBe("Invalid article id")
              );
          });
          it("Invalid methods: 405 - responds with an appropriate error", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const promises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body: { msg } }) =>
                  expect(msg).toBe("Method not allowed")
                );
            });
            return Promise.all(promises);
          });
        });
      });
    });
    describe("/comments", () => {
      describe("/comments/:comment_id", () => {
        it("PATCH: 200 - correctly increments the votes and responds with the updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(Array.isArray(comment)).toBe(false);
              expect(comment.votes).toBe(21);
              expect(comment.comment_id).toBe(1);
              expect(comment.author).toBe("butter_bridge");
              expect(comment.article_id).toBe(9);
              expect(comment.created_at).toBe("2017-11-22T12:36:03.389Z");
              expect(comment.body).toBe(
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              );
            });
        });
        it("PATCH: 200 - correctly decrements the votes and responds with the updated comment", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -3 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(Array.isArray(comment)).toBe(false);
              expect(comment.votes).toBe(13);
              expect(comment.comment_id).toBe(1);
              expect(comment.author).toBe("butter_bridge");
              expect(comment.article_id).toBe(9);
              expect(comment.created_at).toBe("2017-11-22T12:36:03.389Z");
              expect(comment.body).toBe(
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              );
            });
        });
        it("PATCH: 404 - responds with an appropriate error message when a valid but non-existent comment_id is given", () => {
          return request(app)
            .patch("/api/comments/999")
            .send({ inc_votes: -3 })
            .expect(404)
            .then(({ body: { msg } }) => expect(msg).toBe("comment not found"));
        });
        it("PATCH: 400 - responds with anappropriate error message when an invalid comment_id is given", () => {
          return request(app)
            .patch("/api/comments/ilovepie")
            .send({ inc_votes: -3 })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid comment id or payload")
            );
        });
        it("PATCH: 400 - returns an appropriate error when inc_votes is an empty string", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid comment id or payload")
            );
        });
        it("PATCH: 400 - returns an appropriate error when inc_votes is invalid", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid comment id or payload")
            );
        });
        it("PATCH: 200 - ignores other payload properties", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ incc_votes: 1 })
            .expect(200)
            .then(() => {
              return db("comments").where("comment_id", 1);
            })
            .then(([comment]) => {
              expect(comment.votes).toBe(16);
            });
        });
        it("DELETE: 204 - deletes an existing comment by comment_id", () => {
          return request(app)
            .del("/api/comments/1")
            .expect(204)
            .then(() => {
              return db("comments").where("comment_id", 1);
            })
            .then((response) => expect(response.length).toBe(0));
        });
        it("DELETE: 404 - returns an appropriate error when a valid but non-existent comment_id is given", () => {
          return request(app)
            .del("/api/comments/999")
            .expect(404)
            .then(({ body: { msg } }) => expect(msg).toBe("Comment not found"));
        });
        it("DELETE: 400 - returns an appropriate error when an invalid comment_id is given", () => {
          return request(app)
            .del("/api/comments/bacon")
            .expect(400)
            .then(({ body: { msg } }) =>
              expect(msg).toBe("Invalid comment id")
            );
        });
        it("Invalid methods: 405 - responds with an appropriate error", () => {
          const invalidMethods = ["get", "post", "put"];
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405)
              .then(({ body: { msg } }) =>
                expect(msg).toBe("Method not allowed")
              );
          });
          return Promise.all(promises);
        });
      });
    });
  });
});
