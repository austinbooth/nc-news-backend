const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("returns a new object", () => {
    const timestamp = 0;
    const input = [];
    const inputObj = { created_at: timestamp };
    input[0] = inputObj;
    const expectedOutput = [{ created_at: new Date(timestamp) }];
    const output = formatDates(input);
    expect(output).toEqual(expectedOutput);
    expect(output).not.toBe(input);
    expect(output[0]).not.toBe(inputObj);
  });
  test("works for a single object", () => {
    const created_at = 0;
    const input = [
      {
        title: "This is the title",
        topic: "This is the topic",
        author: "an_author",
        body: "Blah",
        created_at,
        votes: 10,
      },
    ];
    const expectedDatetime = new Date(created_at);
    const output = formatDates(input);
    expect(output[0].created_at).toEqual(expectedDatetime);
    expect(output[0]).toEqual(
      expect.objectContaining({
        title: String(input[0].title),
        topic: String(input[0].topic),
        author: String(input[0].author),
        body: String(input[0].body),
        votes: Number(input[0].votes),
      })
    );
  });
  test("works for multiple objects", () => {
    const created_at0 = 86400000;
    const created_at1 = 985134585848;
    const input = [
      {
        title: "This is the title (again)",
        topic: "This is the topic",
        author: "an_author",
        body: "Blah blah blah",
        created_at: created_at0,
        votes: 3,
      },
      {
        title: "Another title",
        topic: "Pies",
        author: "E. Nuff",
        body: "pies pies pies",
        created_at: created_at1,
        votes: 5,
      },
    ];
    const expectedDatetime0 = new Date(created_at0);
    const expectedDatetime1 = new Date(created_at1);
    const output = formatDates(input);
    expect(output[0].created_at).toEqual(expectedDatetime0);
    expect(output[1].created_at).toEqual(expectedDatetime1);
    output.forEach((outputObj, i) => {
      expect(outputObj).toEqual(
        expect.objectContaining({
          title: String(input[i].title),
          topic: String(input[i].topic),
          author: String(input[i].author),
          body: String(input[i].body),
          votes: Number(input[i].votes),
        })
      );
    });
  });
});

describe("makeRefObj", () => {
  test("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).toEqual({});
  });
  test("works for an array with 1 article object", () => {
    const input = [
      {
        article_id: 5,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expectedOutput = {
      "Living in the shadow of a great man": 5,
    };
    expect(makeRefObj(input)).toEqual(expectedOutput);
  });
  test("works for multiple articles", () => {
    const input = [
      {
        article_id: 12,
        title: "article title",
        topic: "My boring title",
        author: "A. N. Other",
        body: "blah",
        created_at: 6945238701593,
        votes: 10,
      },
      {
        article_id: 58,
        title: "The joy of Pig Farming",
        topic: "Self-sufficiency",
        author: "Chris P. Bacon",
        body: "blah blah blah ",
        created_at: 5945239101507,
        votes: 100,
      },
    ];
    const expectedOutput = {
      "article title": 12,
      "The joy of Pig Farming": 58,
    };
    expect(makeRefObj(input)).toEqual(expectedOutput);
  });
});

describe("formatComments", () => {
  test("works for a single comment, and does not mutate the original comment", () => {
    const inputArticles = [
      {
        article_id: 12,
        title: "article title",
        topic: "My boring title",
        author: "A. N. Other",
        body: "blah",
        created_at: 6945238701593,
        votes: 10,
      },
    ];
    const inputComments = [
      {
        body: "blah",
        belongs_to: "article title",
        created_by: "comment_author",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const refObj = makeRefObj(inputArticles);
    const expectedCreatedAt = new Date(inputComments[0].created_at);
    const expectedOutput = [
      {
        body: "blah",
        article_id: 12,
        author: "comment_author",
        votes: 16,
        created_at: expectedCreatedAt,
      },
    ];
    const output = formatComments(inputComments, refObj);
    expect(output).toEqual(expectedOutput);
    expect(inputComments[0]).toEqual(
      expect.objectContaining({
        body: "blah",
        belongs_to: "article title",
        created_by: "comment_author",
        votes: 16,
        created_at: 1511354163389,
      })
    );
  });
  test("works for multiple comments", () => {
    const inputArticles = [
      {
        article_id: 12,
        title: "article title A",
        topic: "Topic 1",
        author: "A. N. Other",
        body: "blah",
        created_at: 6945238701593,
        votes: 10,
      },
      {
        article_id: 17,
        title: "article title B",
        topic: "Topic 2",
        author: "Chris P. Bacon",
        body: "sizzle",
        created_at: 7949681301528,
        votes: 12,
      },
    ];
    const inputComments = [
      {
        body: "blah blah",
        belongs_to: "article title A",
        created_by: "comment_author A",
        votes: 2,
        created_at: 1511354163389,
      },
      {
        body: "blah blah blah",
        belongs_to: "article title B",
        created_by: "comment_author B",
        votes: 7,
        created_at: 4968134163389,
      },
    ];
    const refObj = makeRefObj(inputArticles);
    const expectedCreatedAt0 = new Date(inputComments[0].created_at);
    const expectedCreatedAt1 = new Date(inputComments[1].created_at);
    const expectedOutput = [
      {
        body: "blah blah",
        article_id: 12,
        author: "comment_author A",
        votes: 2,
        created_at: expectedCreatedAt0,
      },
      {
        body: "blah blah blah",
        article_id: 17,
        author: "comment_author B",
        votes: 7,
        created_at: expectedCreatedAt1,
      },
    ];
    const output = formatComments(inputComments, refObj);
    expect(output).toEqual(expectedOutput);
  });
});
