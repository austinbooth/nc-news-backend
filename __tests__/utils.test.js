const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("returns a new object", () => {
    const input = [];
    const inputObj = { created_at: 0 };
    input[0] = inputObj;
    const expectedUnixTimestamp = new Date(0).toISOString();
    const expectedOutput = [{ created_at: expectedUnixTimestamp }];
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
    const expectedDatetime = new Date(created_at).toISOString();
    const output = formatDates(input);
    expect(output[0].created_at).toBe(expectedDatetime);
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
    const expectedDatetime0 = new Date(created_at0).toISOString();
    const expectedDatetime1 = new Date(created_at1).toISOString();
    const output = formatDates(input);
    expect(output[0].created_at).toBe(expectedDatetime0);
    expect(output[1].created_at).toBe(expectedDatetime1);
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

describe("makeRefObj", () => {});

describe("formatComments", () => {});
