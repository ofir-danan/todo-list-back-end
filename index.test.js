const request = require("supertest");
const app = require("./index");

describe("GET route", () => {
  const expectedTask = {
    "my-todo":
    {"priority":"1",
    "date":"1613920702000",
    "text":"aaa"}
  };

  const expectedError = {
    "message": "Illegal ID"
  };

  it("Should return a task by a given id", async () => {
    const response = await request(app).get("/b/1613920702000");
    expect.assertions(2);
    // Is the status code 200
    expect(response.status).toBe(200);

    // are tasks equal
    expect(response.body.record).toEqual(expectedTask);

  });

  it("Should return an error message with status code 400 for illegal id", async () => {
    const response = await request(app).get("/b/aba");

    // Is the status code 400
    expect(response.status).toBe(400);

    // Is the body equal expectedQuote
    expect(response.body["message"]).toBe("Illegal ID");
  });
  
  it("Should return an error message with status code 404 for not found bin", async () => {
    const response = await request(app).get("/b/8");

    // Is the status code 404
    expect(response.status).toBe(404);

    // Is the body equal to the error
    expect(response.body.message).toBe("Bin not found");
  });
});

describe("POST route", () => {
  const date = new Date().getTime().slice(7, 12);
    const taskToSend = {
        "my-todo":
        {"priority":"1",
        "date": date,
        "text":"aaa"}
      };
      
  
  const expectedResponse = {
    "record": taskToSend,
    "metadata": {
      "id": taskToSend["my-todo"]["date"],
    //   "createdAt": `${(new Date)}`,
    }}

  it ("Should post a new task successfully", async () => {
    const response = await request(app).post("/b").send(taskToSend);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
    });
})